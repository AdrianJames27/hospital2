import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PatientNavigation from "./PatientNavigation";
import usePatient from "../util/usePatient";
import useAppointment from "../util/useAppointment";
import StaffNavigation from "./StaffNavigation";
import useDoctor from "../util/useDoctor";

export default function ManageAppointments() {
    const navigate = useNavigate();
    const allowedRole = ['patient', 'doctor'];
    const statusList = ['scheduled', 'completed', 'cancelled'];
    const userSession = JSON.parse(sessionStorage.getItem('userSession'));

    // if role is not any of the allowedRole, go back to login page
    if (!allowedRole.includes(userSession.role)) navigate('/');

    useEffect(() => {
        switch (userSession.role) {
            case 'patient':
                navigate('/hospital/patient/manage_appointments');
                break;
            case 'doctor':
                navigate('/hospital/doctor/manage_appointments');
                break;
            default:
                navigate('/');
                break;
        }
    }, []);

    const [isEditing, setIsEditing] = useState(false);
    const [hasScheduled, setHasScheduled] = useState(false);
    const [appointmentData, setAppointmentData] = useState({
        appointmentId: '',
        appointmentDate: '',
        status: ''
    });

    const {
        isPatientLoading,
        patient,
        showPatient
    } = usePatient();

    const {
        isDoctorLoading,
        doctor,
        showDoctor
    } = useDoctor();

    const {
        appointment,
        isAppointmentLoading,
        hasAppointmentError,
        showAppointment,
        updateAppointment,
        cancelAppointment
    } = useAppointment();

    useEffect(() => {
        async function fetchData() {
            if (userSession.role === 'patient') {
                await showPatient(userSession.email);
            } else {
                await showDoctor(userSession.email);
            }
        }

        fetchData();
    }, []);

    useEffect(() => {
        async function fetchData() {
            if (userSession.role === 'patient') {
                if (patient && patient.length > 0) {
                    const [{ id }] = patient;
                    await showAppointment(userSession.role, id);
                }
            } else {
                if (doctor && doctor.length > 0) {
                    const [{ id }] = doctor;
                    await showAppointment(userSession.role, id);
                }
            }
        }

        fetchData();
    }, [patient, doctor]);

    useEffect(() => {
        if (!hasAppointmentError) {
            setAppointmentData({
                appointmentId: '',
                appointmentDate: '',
                status: ''
            });

            setIsEditing(false);
        }
    }, [appointment]);

    useEffect(() => {
        // Check if there are any scheduled appointments
        setHasScheduled(appointment.some(appointment => appointment.status === 'scheduled'));
    }, [appointment]);

    function handleOnChange(e) {
        const { name, value } = e.target;
        setAppointmentData({ ...appointmentData, [name]: value });
    }

    function handleOnClickResched(appointment) {
        setAppointmentData({
            appointmentId: appointment.id,
            appointmentDate: appointment.appointment_date,
            status: appointment.status
        });

        setIsEditing(true);
    }

    async function handleOnClickCancelSchedule(id) {
        const response = window.confirm('Are you sure to cancel appointment?');

        if (response) {
            await cancelAppointment(id);

            if (userSession.role === 'patient') {
                await showPatient(userSession.email);
            } else {
                await showDoctor(userSession.email);
            }
        }
    }

    function formatDateTime(dateTime) {
        return new Date(dateTime).toISOString().slice(0, 19).replace('T', ' ');
    }

    function handleOnClickCancel() {
        setAppointmentData({
            appointmentId: '',
            appointmentDate: '',
            status: ''
        });

        setIsEditing(false);
    }

    async function handleOnSubmit(e) {
        e.preventDefault();

        const appointment = {
            id: appointmentData.appointmentId,
            appointment_date: formatDateTime(appointmentData.appointmentDate),
            status: appointmentData.status
        };

        await updateAppointment(appointment);

        if (userSession.role === 'patient') {
            const [{ id }] = patient;
            await showAppointment(userSession.role, id);
        } else {
            const [{ id }] = doctor;
            await showAppointment(userSession.role, id);
        }
    }

    return (
        <div>
            {(userSession.role === 'patient' && <PatientNavigation />) || (
                userSession.role === 'doctor' && <StaffNavigation userRole={userSession.role} />
            )}
            <h1>Manage Appointments</h1>
            {(isPatientLoading || isDoctorLoading || isAppointmentLoading) ? (
                <p>Loading appointments...</p>
            ) : (
                (!hasScheduled ? (
                    <tr><td colSpan={'4'}>No Scheduled Appointment/s</td></tr>
                ) : (
                    <>
                        <div>
                            <form onSubmit={handleOnSubmit}>
                                <label htmlFor="appointmentDate">Appointment Date</label>
                                <input
                                    type="datetime-local"
                                    name="appointmentDate"
                                    disabled={!isEditing || userSession.role === 'doctor' && isEditing}
                                    value={appointmentData.appointmentDate}
                                    onChange={handleOnChange}
                                /> <br />
                                <label htmlFor="status">Status</label>
                                <select
                                    disabled={!isEditing || userSession.role === 'patient' && isEditing}
                                    name="status"
                                    onChange={handleOnChange}
                                    value={appointmentData.status}
                                >
                                    <option value={''}>Select Status</option>
                                    {statusList.map((status, index) => (
                                        <option key={index} value={status}>{status}</option>
                                    ))}
                                </select> <br />
                                {
                                    isEditing &&
                                    <>
                                        <input
                                            type="submit"
                                            value={'Edit Appointment'}
                                        />
                                        <input
                                            type="button"
                                            value={'Cancel'}
                                            onClick={handleOnClickCancel}
                                        />
                                    </>
                                }
                            </form>
                        </div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Appointment Date</th>
                                    <th>Status</th>
                                    <th>Reason</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointment.map(appointment => {
                                    if (appointment.status === 'scheduled') {
                                        return (
                                            <tr key={appointment.id}>
                                                <td>{appointment.appointment_date}</td>
                                                <td>{appointment.status}</td>
                                                <td>{appointment.reason}</td>
                                                <td>
                                                    <button onClick={() => handleOnClickResched(appointment)}>
                                                        {userSession.role === 'patient' ? 'Reschedule' : 'Update Status'}
                                                    </button>
                                                    {
                                                        userSession.role === 'patient' &&
                                                        <button onClick={() => handleOnClickCancelSchedule(appointment.id)}>
                                                            Cancel Schedule
                                                        </button>
                                                    }
                                                </td>
                                            </tr>
                                        );
                                    }
                                })}
                            </tbody>
                        </table>
                    </>
                ))
            )}
        </div>
    );
}