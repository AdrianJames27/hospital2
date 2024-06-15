import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import StaffNavigation from "./StaffNavigation";
import useMedicalRecord from "../util/useMedicalRecord";
import usePatient from "../util/usePatient";
import useDoctor from "../util/useDoctor";

export default function ManageMedicalRecords() {
    const navigate = useNavigate();
    const userSession = JSON.parse(sessionStorage.getItem('userSession'));

    // role is not doctor, go back to login page
    if (userSession.role !== 'doctor') navigate('/');

    const dialogRef = useRef(null);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState({});
    const [selectedMedicalRecord, setSelectedMedicalRecord] = useState({});
    const [medicalRecordData, setMedicalRecordData] = useState({
        id: '',
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
                id: '',
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

    function handleEdit(medicalRecord) {
        setMedicalRecordData({
            id: medicalRecord.id,
            patientId: medicalRecord.patient_id,
            visitDate: medicalRecord.visit_date,
            diagnosis: medicalRecord.diagnosis,
            treatment: medicalRecord.treatment,
            notes: medicalRecord.notes
        });

        setIsEditing(true);
    }

    function handleOnClickCancel() {
        setMedicalRecordData({
            id: '',
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
            id: medicalRecordData.id,
            patientId: medicalRecordData.patientId,
            doctorId: id,
            visitDate: medicalRecordData.visitDate,
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
            <div className="container">
                <div class= "medrec">
                    <h1 class="lblmedrec">Manage Medical Records</h1>
                <form onSubmit={handleSubmit}>
                <div className="row mb-4 form-group">
                    <label class="col-form-label"htmlFor="patientId">Select a Patient</label>
                    <select  class="form-select" required name="patientId" onChange={handleOnChange} value={medicalRecordData.patientId}>
                        <option disabled value={''}>Select Patient</option>
                        {
                            patients.map(patient => (
                                <option key={patient.id} value={patient.id}>
                                    {patient.first_name} {patient.last_name}
                                </option>
                            ))
                        }
                    </select> 

                </div>

                <div className="row mb-4 form-group">
                    <label class="col-form-label">Visit Date</label>
                    <input
                        class="form-control"
                        type="date"
                        name="visitDate"
                        value={medicalRecordData.visitDate}
                        onChange={handleOnChange}
                        required
                    /> 

                </div>  

                <div className="row mb-4 form-group">
                    <label class="col-form-label">Diagnosis</label>
                    <input
                        class="form-control"
                        type="text"
                        name="diagnosis"
                        value={medicalRecordData.diagnosis}
                        onChange={handleOnChange}
                        required
                    /> 

                </div>

                <div className="row mb-4 form-group">
                    <label class="col-form-label">Treatment</label>
                    <input
                        class="form-control"
                        type="text"
                        name="treatment"
                        value={medicalRecordData.treatment}
                        onChange={handleOnChange}
                        required
                    />

                </div>

                <div className="row mb-4 form-group">
                    <label class="col-form-label">Notes</label>
                    <input
                        class="form-control"
                        type="text"
                        name="notes"
                        value={medicalRecordData.notes}
                        onChange={handleOnChange}
                        required
                    /> 

                </div>
                <div class = "upbtncon">
                    <input
                       
                        class="btn-save"
                        type="submit"
                        value={isEditing ? 'Update Medical Record' : 'Add Medical Record'}
                    />
                    {
                        isEditing &&
                        <input
                            class="btn-cancel"
                            type="button"
                            value={'Cancel'}
                            onClick={handleOnClickCancel}
                        />
                    }
                </div>
                </form>
                </div>
                <div class="tblcon">
                     <h1 class="lblmedrec">Medical Record List</h1>
                {(isMedicalRecordLoading || isPatientLoading) ? (
                    <p className="norec">Loading medical records...</p>
                ) : (!medicalRecords || medicalRecords.length === 0) ? (
                    <p className="norec">Medical records list is empty</p>
                ) : (
                    
                    <table className="table table-striped">
                        <thead >
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
                                                <button class ="view-mr" onClick={() => viewMedicalRecord(patient, medicalRecord)}>View</button>
                                                <button  class = "edit-mr"onClick={() => handleEdit(medicalRecord)}>Edit</button>
                                            </td>
                                        </tr>
                                    )
                                ))
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
            </div>
        );
    }

    return (
        <div>
            <StaffNavigation userRole={userSession.role} />
            <div>
                <h1>Manage Medical Records</h1>
                {displayContent()}
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
                <button className="btnback" onClick={handleCloseDialog}>Close</button>
            </dialog>
        </div>
    );
}
