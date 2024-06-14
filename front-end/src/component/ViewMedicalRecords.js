import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StaffNavigation from "./StaffNavigation";
import usePatient from "../util/usePatient";
import useDoctor from "../util/useDoctor";
import useMedicalRecord from "../util/useMedicalRecord";

export default function ViewMedicalRecords() {
    const navigate = useNavigate();
    const userSession = JSON.parse(sessionStorage.getItem('userSession'));

    // if userSession is empty and role is not admin, go back to login page
    if (!userSession || userSession.role !== 'admin') navigate('/');

    const {
        isPatientLoading,
        patients,
        fetchPatients
    } = usePatient();

    const {
        isDoctorLoading,
        doctors,
        fetchDoctors
    } = useDoctor();

    const {
        isMedicalRecordLoading,
        medicalRecords,
        fetchMedicalRecords
    } = useMedicalRecord();

    useEffect(() => {
        async function fetchData() {
            await fetchPatients();
            await fetchDoctors();
            await fetchMedicalRecords();
        }

        fetchData();
    }, []);

    function findPatient(patientId) {
        if (!patients || patients.length === 0) {
            return patientId;
        } else {
            const patient = patients.find(patient => patient.id === patientId);
            return (`${patient.first_name} ${patient.last_name}`);
        }
    }

    function findDoctor(doctorId) {
        if (!doctors || doctors.length === 0) {
            return doctorId;
        } else {
            const doctor = doctors.find(doctor => doctor.id === doctorId);
            return (`${doctor.first_name} ${doctor.last_name}`);
        }
    }

    return (
        <div>
            <StaffNavigation userRole={userSession.role} />
            <h1>Medical Record List</h1>
            {(isPatientLoading || isDoctorLoading || isMedicalRecordLoading) ? (
                <p>Loading medical records...</p>
            ) : (
                ((!patients || patients.length === 0) ||
                    (!doctors || doctors.length === 0) ||
                    (!medicalRecords || medicalRecords.length === 0)) ? (
                    <p>There are no medical records yet</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Medical Record ID</th>
                                <th>Patient Name</th>
                                <th>Doctor Name</th>
                                <th>Visit Date</th>
                                <th>Diagnosis</th>
                                <th>Treatment</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {medicalRecords.map(medicalRecord => (
                                <tr key={medicalRecord.id}>
                                    <td>{medicalRecord.id}</td>
                                    <td>{findPatient(medicalRecord.patient_id)}</td>
                                    <td>{findDoctor(medicalRecord.doctor_id)}</td>
                                    <td>{medicalRecord.visit_date}</td>
                                    <td>{medicalRecord.diagnosis}</td>
                                    <td>{medicalRecord.treatment}</td>
                                    <td>{medicalRecord.notes}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )
            )}
        </div>
    );
}