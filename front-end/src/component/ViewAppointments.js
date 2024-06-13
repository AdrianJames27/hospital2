import { useNavigate } from "react-router-dom";
import StaffNavigation from "./StaffNavigation";
import useAppointment from "../util/useAppointment";
import { useEffect } from "react";

export default function ViewAppoinments() {
    const navigate = useNavigate();
    const userSession = JSON.parse(sessionStorage.getItem('userSession'));

    // if userSession is empty and role is not admin, go back to login page
    if (!userSession && userSession.role !== 'admin') navigate('/');

    const {
        isAppointmentLoading,
        appointments,
        fetchAppointments
    } = useAppointment();

    useEffect(() => {
        async function fetchData() {
            await fetchAppointments();
        }

        fetchData();
    }, []);

    return (
        <div>
            <StaffNavigation userRole={userSession.role} />
            <h1>Appointment List</h1>
            {
                isAppointmentLoading ? (
                    <p>Loading appointment records...</p>
                ) : (
                    (!appointments || appointments.length === 0) ? (
                        <p>There are no appointments yet</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Appointment ID</th>
                                    <th>Patient ID</th>
                                    <th>Doctor ID</th>
                                    <th>Appointment Date</th>
                                    <th>Status</th>
                                    <th>Reason</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointments.map(appointment => (
                                    <tr key={appointment.id}>
                                        <td>{appointment.id}</td>
                                        <td>{appointment.patient_id}</td>
                                        <td>{appointment.doctor_id}</td>
                                        <td>{appointment.appointment_date}</td>
                                        <td>{appointment.status}</td>
                                        <td>{appointment.reason}</td>
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