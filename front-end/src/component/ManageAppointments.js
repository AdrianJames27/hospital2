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
        status: '',
        reason: ''
    });

    const {
        isPatientLoading,
        patients,
        patient,
        fetchPatients,
        showPatient
    } = usePatient();

    const {
        isDoctorLoading,
        doctors,
        doctor,
        fetchDoctors,
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
                await fetchDoctors();
            } else {
                await showDoctor(userSession.email);
                await fetchPatients();
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
                status: '',
                reason: ''
            });

            setIsEditing(false);
        }
    }, [appointment]);

    useEffect(() => {
        // Check if there are any scheduled appointments
        setHasScheduled(appointment.some(appointment => appointment.status === 'scheduled'));
    }, [appointment]);

    function displayPatientNameById(patientId) {
        if (!patients || patients.length === 0) {
            return patientId;
        } else {
            const patient = patients.find(patient => patient.id === patientId);
            return (`${patient.first_name} ${patient.last_name}`);
        }
    }

    function displayDoctorNameById(doctorId) {
        if (!doctors || doctors.length === 0) {
            return doctorId;
        } else {
            const doctor = doctors.find(doctor => doctor.id === doctorId);
            return (`${doctor.first_name} ${doctor.last_name}`);
        }
    }

    function handleOnChange(e) {
        const { name, value } = e.target;
        setAppointmentData({ ...appointmentData, [name]: value });
    }

    function handleOnClickResched(appointment) {
        setAppointmentData({
            appointmentId: appointment.id,
            appointmentDate: appointment.appointment_date,
            status: appointment.status,
            reason: appointment.reason
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
            status: '',
            reason: ''
        });

        setIsEditing(false);
    }

    async function handleOnSubmit(e) {
        e.preventDefault();

        const appointment = {
            id: appointmentData.appointmentId,
            appointmentDate: formatDateTime(appointmentData.appointmentDate),
            status: appointmentData.status,
            reason: appointmentData.reason
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
        <div class="container app">
            {(userSession.role === 'patient' && <PatientNavigation />) ||
                (userSession.role === 'doctor' && <StaffNavigation userRole={userSession.role} />)
            }
            <h1 class="lbl">Manage Appointments</h1>
            {(isPatientLoading || isDoctorLoading || isAppointmentLoading) ? (
                <p className="norec">Loading appointments...</p>
            ) : (
                (!hasScheduled ? (
                    <p className="norec">No Scheduled Appointment/s</p>
                ) : (
                    <>
                        <div class=" container appcon">
                            <form onSubmit={handleOnSubmit}>
                                <div className="row mb-4 form-group">
                                    <label class="col-form-label" htmlFor="appointmentDate">Appointment Date</label>
                                    <input
                                        class="form-control"
                                        type="datetime-local"
                                        name="appointmentDate"
                                        disabled={!isEditing || (userSession.role === 'doctor' && isEditing)}
                                        value={appointmentData.appointmentDate}
                                        onChange={handleOnChange}
                                        required
                                    />
                                </div>

                                <div className="row mb-4 form-group">
                                    <label class="col-form-label" htmlFor="status">Status</label>
                                    <select class="form-select"
                                        disabled={!isEditing || (userSession.role === 'patient' && isEditing)}
                                        name="status"
                                        onChange={handleOnChange}
                                        value={appointmentData.status}
                                        required
                                    >
                                        <option disabled value={''}>Select Status</option>
                                        {statusList.map((status, index) => (
                                            <option key={index} value={status}>{status}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="row mb-4 form-group">
                                    <label class="col-form-label" htmlFor="status">Reason</label>
                                    <input
                                        class="form-control"
                                        type="text"
                                        name="reason"
                                        disabled={!isEditing || (userSession.role === 'doctor' && isEditing)}
                                        value={appointmentData.reason}
                                        placeholder="Enter your reason"
                                        onChange={handleOnChange}
                                        required
                                    />
                                </div>
                                <div class="upbtncon">
                                    {

                                        isEditing &&
                                        <>
                                            <div className="row mb-4 form-group">
                                                <input
                                                    className="btn-save"
                                                    type="submit"
                                                    value={userSession.role === 'patient' ? 'Update Appointment' : 'Update Status'}
                                                />
                                                <input
                                                    className="btn-cancel"
                                                    type="button"
                                                    value={'Cancel'}
                                                    onClick={handleOnClickCancel}
                                                />
                                            </div>
                                        </>
                                    }
                                </div>
                            </form>
                        </div>
                        <div class="container">
                            <h1 class="lblmedrec app"> Scheduled Appointments </h1>
                            <table class="table table-striped">
                                <thead >
                                    <tr>
                                        {(userSession.role === 'patient' && <th>Doctor Name</th>) ||
                                            (userSession.role === 'doctor' && <th>Patient Name</th>)
                                        }
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
                                                    {(userSession.role === 'patient' && <td>{displayDoctorNameById(appointment.doctor_id)}</td>) ||
                                                        (userSession.role === 'doctor' && <td>{displayPatientNameById(appointment.patient_id)}</td>)
                                                    }
                                                    <td>{appointment.appointment_date}</td>
                                                    <td>{appointment.status}</td>
                                                    <td>{appointment.reason}</td>
                                                    <td>
                                                        <button className="edit-mr" onClick={() => handleOnClickResched(appointment)}>
                                                            {userSession.role === 'patient' ? 'Reschedule' : 'Edit Status'}
                                                        </button>
                                                        {
                                                            userSession.role === 'patient' &&
                                                            <button className="cancelsched" onClick={() => handleOnClickCancelSchedule(appointment.id)}>
                                                                Cancel Schedule
                                                            </button>
                                                        }
                                                    </td>
                                                </tr>
                                            );
                                        } else {
                                            return null;
                                        }
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </>
                ))
            )}
        </div>
    );
}