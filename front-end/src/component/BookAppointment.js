import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PatientNavigation from './PatientNavigation';
import useDoctor from "../util/useDoctor";
import usePatient from "../util/usePatient";
import useAppointment from "../util/useAppointment";
import StaffNavigation from "./StaffNavigation";

export default function BookAppointment() {
    const navigate = useNavigate();
    const userSession = JSON.parse(sessionStorage.getItem('userSession'));
    const allowedRole = ['patient', 'receptionist'];

    // if userSession is empty and role is not admin, go back to login page
    if (!userSession && !allowedRole.includes(userSession.role)) navigate('/');

    const [appointmentData, setAppointmentData] = useState({
        appointmentDate: '',
        reason: ''
    });
    const [selectedDoctorId, setSelectedDoctorId] = useState(null);
    const [selectedPatientId, setSelectedPatientId] = useState('');
    const dialogRef = useRef(null);


    const {
        isDoctorLoading,
        doctors,
        fetchDoctors,
    } = useDoctor();

    const {
        isPatientLoading,
        patient,
        patients,
        showPatient,
        fetchPatients
    } = usePatient();

    const {
        hasAppointmentError,
        bookAppointment
    } = useAppointment();

    useEffect(() => {
        async function fetchDatas() {
            await fetchDoctors();
            if (userSession.role === 'patient') {
                await showPatient(userSession.email);
            } else {
                await fetchPatients();
            }
        }

        fetchDatas();
    }, []);

    useEffect(() => {
        if (!hasAppointmentError) {
            setAppointmentData({
                appointmentDate: '',
                reason: ''
            });
        }
    }, [hasAppointmentError]);

    function handleOnChangeSelect(e) {
        const { value } = e.target;
        setSelectedPatientId(value);
    }

    function handleOnBookAppointment(doctorId) {
        setSelectedDoctorId(doctorId);
        dialogRef.current.showModal();
    }

    function handleCloseDialog() {
        dialogRef.current.close();
        setSelectedDoctorId(null);
    }

    function handleOnChange(e) {
        const { name, value } = e.target;
        setAppointmentData({ ...appointmentData, [name]: value });
    }

    function formatDateTime(dateTime) {
        return new Date(dateTime).toISOString().slice(0, 19).replace('T', ' ');
    }

    async function handleOnSubmit(e) {
        e.preventDefault();

        let patientId;

        if (patient.length === 0) {
            window.alert('You don\'t have a patient medical record yet');
        } else if (userSession.role === 'patient' && patient.length !== 0) {
            // fetch only the id
            const [{ id }] = patient;
            patientId = id;
        } else if (userSession.role === 'receptionist') {
            patientId = selectedPatientId;
        }

        if (userSession.role === 'patient' || userSession.role === 'receptionist' || patient.length !== 0) {
            const appointment = {
                patientId: patientId,
                doctorId: selectedDoctorId,
                appointmentDate: formatDateTime(appointmentData.appointmentDate),
                status: 'scheduled',
                reason: appointmentData.reason
            };
    
            await bookAppointment(appointment);
        }
    }

    return (
        <div>
            {(userSession.role === 'patient' && <PatientNavigation />) ||
                (userSession.role === 'receptionist' && <StaffNavigation userRole={userSession.role} />
                )}
            <div>
                <div>
                    <h1>Book Appointment with Doctor</h1>
                    {userSession.role === 'patient' &&
                        <Link to="/hostpital/patient/manage_appointments">
                            Manage Appointments
                        </Link>
                    }
                </div>
                {isDoctorLoading || isPatientLoading ? (
                    <p>Loading doctors list...</p>
                ) : (
                    (!doctors || doctors.length === 0) ? (
                        <p>There is no doctor</p>
                    ) : (
                        <>
                            {doctors.map(doctor => (
                                <div key={doctor.id} style={{ border: '2px black solid', margin: '2rem' }}>
                                    <p>{doctor.first_name} {doctor.last_name}</p>
                                    <p>{doctor.specialization}</p>
                                    <p>{doctor.license_number}</p>
                                    <p>{doctor.phone}</p>
                                    <button onClick={() => handleOnBookAppointment(doctor.id)}>Book Appointment</button>
                                </div>
                            ))}
                        </>
                    )
                )}
            </div>
            <dialog ref={dialogRef}>
                <h2>Book Appointment</h2>
                <form onSubmit={handleOnSubmit}>
                    {
                        userSession.role === 'receptionist' &&
                        <>
                            <label>Select a Patient</label>
                            <select required onChange={handleOnChangeSelect} value={selectedPatientId}>
                                <option disabled value={''}>Select a Patient</option>
                                {patients.map(patientMember => (
                                    <option key={patientMember.id} value={patientMember.id}>
                                        {patientMember.first_name} {patientMember.last_name}
                                    </option>
                                ))}
                            </select> <br />
                        </>
                    }
                    <label htmlFor="appointmentDate">Appointment Date</label>
                    <input
                        type="datetime-local"
                        name="appointmentDate"
                        onChange={handleOnChange}
                        required
                    /> <br />
                    <label htmlFor="reason">Reason</label>
                    <input
                        type="text"
                        name="reason"
                        onChange={handleOnChange}
                        required
                    /> <br />
                    <input
                        type="submit"
                        value={'Schedule an Appointment'}
                    />
                </form>
                <br />
                <button onClick={handleCloseDialog}>Close</button>
            </dialog>
        </div>
    );
}
