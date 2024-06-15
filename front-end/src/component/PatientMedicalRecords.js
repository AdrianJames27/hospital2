import { useNavigate } from "react-router-dom";
import PatientNavigation from "./PatientNavigation";
import usePatient from "../util/usePatient";
import useDoctor from "../util/useDoctor";
import useMedicalRecord from "../util/useMedicalRecord";
import { useEffect } from "react";

export default function PatientMedicalRecords() {
    const navigate = useNavigate();
    const userSession = JSON.parse(sessionStorage.getItem('userSession'));

    // if role is not patient, go back to login page
    if (userSession.role !== 'patient') navigate('/');

    const {
        isPatientLoading,
        patient,
        showPatient
    } = usePatient();

    const {
        isDoctorLoading,
        doctors,
        fetchDoctors
    } = useDoctor();

    const {
        isMedicalRecordLoading,
        medicalRecord,
        showMedicalRecords
    } = useMedicalRecord();

    useEffect(() => {
        async function fetchData() {
            await showPatient(userSession.email);
            await fetchDoctors();
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

    function displayDoctorNameById(doctorId) {
        if (!doctors || doctors.length === 0) {
            return doctorId;
        } else {
            const doctor = doctors.find(doctor => doctor.id === doctorId);
            return (`${doctor.first_name} ${doctor.last_name}`);
        }
    }

    return (
        <div className="container">
            <PatientNavigation />
            <h1 className="lbl">Medical Records</h1>
            {isPatientLoading || isDoctorLoading || isMedicalRecordLoading ? (
                <p className="norec">Loading medical records...</p>
            ) : (
                (!medicalRecord || medicalRecord.length === 0) ? (
                    <p className="norec">You have no medical record/s yet</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Doctor Name</th>
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
                                            <td>{displayDoctorNameById(record.doctor_id)}</td>
                                            <td>{record.visit_date}</td>
                                            <td>{record.diagnosis}</td>
                                            <td>{record.treatment}</td>
                                            <td>{record.notes}</td>
                                        </tr>
                                    );
                                } else {
                                    return null;
                                }
                            })}
                        </tbody>
                    </table>
                )
            )}
        </div>
    );
}