import { useNavigate } from "react-router-dom";
import PatientNavigation from "./PatientNavigation";
import usePatient from "../util/usePatient";
import useMedicalRecord from "../util/useMedicalRecord";
import { useEffect } from "react";

export default function PatientMedicalRecords() {
    const navigate = useNavigate();
    const userSessionString = sessionStorage.getItem('userSession');
    const userSession = JSON.parse(sessionStorage.getItem('userSession'));

    // if userSession is empty or the role is not the 
    // same to the designated role, go back to login page
    if (!userSessionString) {
        navigate('/');
    } else {
        try {
            // If userSession exists but the role is not the designated role, redirect to the login page
            if (userSession.role !== 'patient') navigate('/');
        } catch (error) {
            // If JSON parsing fails, redirect to the login page
            console.error("Failed to parse userSession:", error);
            navigate('/');
        }
    }

    const {
        isPatientLoading,
        patient,
        showPatient
    } = usePatient();

    const {
        isMedicalRecordLoading,
        medicalRecord,
        showMedicalRecords
    } = useMedicalRecord();

    useEffect(() => {
        async function fetchData() {
            await showPatient(userSession.email);
        }

        fetchData();
    }, []);

    useEffect(() => {
        async function fetchData() {
            if (patient && patient.length > 0) {
                const [{ id }] = patient;
                await showMedicalRecords(id);
            }
        }

        fetchData();
    }, [patient]);

    return (
        <div>
            <PatientNavigation />
            <h1>Medical Records</h1>
            {isPatientLoading || isMedicalRecordLoading ? (
                <p>Loading medical records...</p>
            ) : (
                (!medicalRecord || medicalRecord.length === 0) ? (
                    <p>You have no medical record/s yet</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Visit Date</th>
                                <th>Diagnosis</th>
                                <th>Treatment</th>
                                <th>Notes</th>
                            </tr>
                        </thead>
                        <tbody>
                            {medicalRecord.map(record => {
                                const [{ id }] = patient;
                                if (id === record.patient_id) {
                                    return (
                                        <tr key={record.id}>
                                            <td>{record.visit_date}</td>
                                            <td>{record.diagnosis}</td>
                                            <td>{record.treatment}</td>
                                            <td>{record.notes}</td>
                                        </tr>
                                    );
                                }
                            })}
                        </tbody>
                    </table>
                )
            )}
        </div>
    );
}