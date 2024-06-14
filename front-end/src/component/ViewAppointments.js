import { useNavigate } from "react-router-dom";
import StaffNavigation from "./StaffNavigation";
import useAppointment from "../util/useAppointment";
import { useEffect } from "react";
import usePatient from "../util/usePatient";
import useDoctor from "../util/useDoctor";

export default function ViewAppoinments() {
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
            if (userSession.role !== 'admin') navigate('/');
        } catch (error) {
            // If JSON parsing fails, redirect to the login page
            console.error("Failed to parse userSession:", error);
            navigate('/');
        }
    }

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
        isAppointmentLoading,
        appointments,
        fetchAppointments
    } = useAppointment();

    useEffect(() => {
        async function fetchData() {
            await fetchPatients();
            await fetchDoctors();
            await fetchAppointments();
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
            <h1>Appointment List</h1>
            {(isPatientLoading || isDoctorLoading || isAppointmentLoading) ? (
                <p>Loading appointment records...</p>
            ) : (
                ((!patients || patients.length === 0) ||
                    (!doctors || doctors.length === 0) ||
                    (!appointments || appointments.length === 0)) ? (
                    <p>There are no appointments yet</p>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Appointment ID</th>
                                <th>Patient Name</th>
                                <th>Doctor Name</th>
                                <th>Appointment Date</th>
                                <th>Status</th>
                                <th>Reason</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map(appointment => (
                                <tr key={appointment.id}>
                                    <td>{appointment.id}</td>
                                    <td>{findPatient(appointment.patient_id)}</td>
                                    <td>{findDoctor(appointment.doctor_id)}</td>
                                    <td>{appointment.appointment_date}</td>
                                    <td>{appointment.status}</td>
                                    <td>{appointment.reason}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )
            )}
        </div>
    );
}