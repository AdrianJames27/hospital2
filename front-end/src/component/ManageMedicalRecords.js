import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import StaffNavigation from "./StaffNavigation";
import useMedicalRecord from "../util/useMedicalRecord";
import usePatient from "../util/usePatient";
import useDoctor from "../util/useDoctor";

export default function ManageMedicalRecords() {
    const navigate = useNavigate();
    const userSession = JSON.parse(sessionStorage.getItem('userSession'));

    // if userSession is empty or role is not any of the allowedUser, go back to login page
    if (!userSession || userSession.role !== 'doctor') navigate('/');

    const dialogRef = useRef(null);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState({});
    const [selectedMedicalRecord, setSelectedMedicalRecord] = useState({});
    const [medicalRecordData, setMedicalRecordData] = useState({
        patientId: '',
        visitDate: '',
        diagnosis: '',
        treatment: '',
        notes: ''
    });

    const {
        isMedicalRecordLoading,
        hasMedicalRecordError,
        medicalRecords,
        fetchMedicalRecords,
        addMedicalRecord,
        updateMedicalRecord
    } = useMedicalRecord();

    const {
        isPatientLoading,
        patients,
        fetchPatients
    } = usePatient();

    const {
        doctor,
        showDoctor
    } = useDoctor();

    useEffect(() => {
        async function fetchData() {
            await showDoctor(userSession.email);
            await fetchPatients();
            await fetchMedicalRecords();
        }

        fetchData();
    }, []);

    useEffect(() => {
        if (!hasMedicalRecordError) {
            setMedicalRecordData({
                patientId: '',
                visitDate: '',
                diagnosis: '',
                treatment: '',
                notes: ''
            });

            setIsEditing(false);
        }
    }, [medicalRecords]);

    function viewMedicalRecord(patient, medicalRecord) {
        setSelectedPatient(patient);
        setSelectedMedicalRecord(medicalRecord);
        dialogRef.current.showModal();
    }

    function handleEdit(patient, medicalRecord) {
        setMedicalRecordData({
            patientId: patient.id,
            visitDate: medicalRecord.visit_date,
            diagnosis: medicalRecord.diagnosis,
            treatment: medicalRecord.treatment,
            notes: medicalRecord.notes
        });

        setIsEditing(true);
    }

    function handleOnClickCancel() {
        setMedicalRecordData({
            patientId: '',
            visitDate: '',
            diagnosis: '',
            treatment: '',
            notes: ''
        });

        setIsEditing(false)
    }

    function handleCloseDialog() {
        dialogRef.current.close();
    }

    function handleOnChange(e) {
        const { name, value } = e.target;
        setMedicalRecordData({ ...medicalRecordData, [name]: value });
    }

    async function handleSubmit(e) {
        e.preventDefault();

        // fetch only the id
        const [{ id }] = doctor;

        const medicalRecord = {
            patient_id: medicalRecordData.patientId,
            doctor_id: id,
            visit_date: medicalRecordData.visitDate,
            diagnosis: medicalRecordData.diagnosis,
            treatment: medicalRecordData.treatment,
            notes: medicalRecordData.notes
        };

        if (isEditing) {
            await updateMedicalRecord(medicalRecord);
        } else {
            await addMedicalRecord(medicalRecord);
        }

        await fetchMedicalRecords();
    }

    function displayContent() {
        return (
            <div>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="">Select a Patient</label>
                    <select required name="patientId" onChange={handleOnChange} value={medicalRecordData.patientId}>
                        <option disabled value={''}>Select Patient</option>
                        {
                            patients.map(patient => (
                                <option key={patient.id} value={patient.id}>
                                    {patient.first_name} {patient.last_name}
                                </option>
                            ))
                        }
                    </select> <br />
                    <label>Visit Date</label>
                    <input
                        type="date"
                        name="visitDate"
                        value={medicalRecordData.visitDate}
                        onChange={handleOnChange}
                        required
                    /> <br />
                    <label>Diagnosis</label>
                    <input
                        type="text"
                        name="diagnosis"
                        value={medicalRecordData.diagnosis}
                        onChange={handleOnChange}
                        required
                    /> <br />
                    <label>Treatment</label>
                    <input
                        type="text"
                        name="treatment"
                        value={medicalRecordData.treatment}
                        onChange={handleOnChange}
                        required
                    /> <br />
                    <label>Notes</label>
                    <input
                        type="text"
                        name="notes"
                        value={medicalRecordData.notes}
                        onChange={handleOnChange}
                        required
                    /> <br />
                    <input
                        type="submit"
                        value={isEditing ? 'Update Medical Record' : 'Add Medical Record'}
                    />
                    {
                        isEditing &&
                        <input
                            type="button"
                            value={'Cancel'}
                            onClick={handleOnClickCancel}
                        />
                    }
                </form>
                {(!isMedicalRecordLoading && medicalRecords.length === 0) ? (
                    <p>No medical record/s yet</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Patient Name</th>
                                <th>Visit Date</th>
                                <th>Diagnosis</th>
                                <th>Treatment</th>
                                <th>Notes</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.map(patient => (
                                medicalRecords.map(medicalRecord => (
                                    patient.id === medicalRecord.patient_id && (
                                        <tr key={medicalRecord.id}>
                                            <td>{patient.first_name} {patient.last_name}</td>
                                            <td>{medicalRecord.visit_date}</td>
                                            <td>{medicalRecord.diagnosis}</td>
                                            <td>{medicalRecord.treatment}</td>
                                            <td>{medicalRecord.notes}</td>
                                            <td>
                                                <button onClick={() => viewMedicalRecord(patient, medicalRecord)}>View</button>
                                                <button onClick={() => handleEdit(patient, medicalRecord)}>Edit</button>
                                            </td>
                                        </tr>
                                    )
                                ))
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        );
    }

    return (
        <div>
            <StaffNavigation userRole={userSession.role} />
            <div>
                <h1>Manage Medical Records</h1>
                {
                    isMedicalRecordLoading || isPatientLoading ? (
                        <p>Loading contents...</p>
                    ) : (
                        displayContent()
                    )
                }
            </div>
            <dialog ref={dialogRef}>
                <h2>Medical Record of {selectedPatient.first_name} {selectedPatient.last_name}</h2>
                <div>
                    <p>Visit Date: {selectedMedicalRecord.visit_date}</p>
                    <p>Diagnosis: {selectedMedicalRecord.diagnosis}</p>
                    <p>Treatment: {selectedMedicalRecord.treatment}</p>
                    <p>Notes: {selectedMedicalRecord.notes}</p>
                </div>
                <br />
                <button onClick={handleCloseDialog}>Close</button>
            </dialog>
        </div>
    );
}
