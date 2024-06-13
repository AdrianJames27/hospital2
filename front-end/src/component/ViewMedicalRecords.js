import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StaffNavigation from "./StaffNavigation";
import useMedicalRecord from "../util/useMedicalRecord";

export default function ViewMedicalRecords() {
    const navigate = useNavigate();
    const userSession = JSON.parse(sessionStorage.getItem('userSession'));

    // if userSession is empty and role is not admin, go back to login page
    if (!userSession && userSession.role !== 'admin') navigate('/');

    const {
        isMedicalRecordLoading,
        medicalRecords,
        fetchMedicalRecords
    } = useMedicalRecord();

    useEffect(() => {
        async function fetchData() {
            await fetchMedicalRecords();
        }

        fetchData();
    }, []);

    return (
        <div>
            <StaffNavigation userRole={userSession.role} />
            <h1>Medical Record List</h1>
            {
                isMedicalRecordLoading ? (
                    <p>Loading medical records...</p>
                ) : (
                    (!medicalRecords || medicalRecords.length === 0) ? (
                        <p>There are no medical records yet</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Medical Record ID</th>
                                    <th>Patient ID</th>
                                    <th>Doctor ID</th>
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
                                        <td>{medicalRecord.patient_id}</td>
                                        <td>{medicalRecord.doctor_id}</td>
                                        <td>{medicalRecord.visit_date}</td>
                                        <td>{medicalRecord.diagnosis}</td>
                                        <td>{medicalRecord.treatment}</td>
                                        <td>{medicalRecord.notes}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )
                )
            }
        </div>
    );
}