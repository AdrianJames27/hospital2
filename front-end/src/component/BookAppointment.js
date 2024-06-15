import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import PatientNavigation from './PatientNavigation';
import useDoctor from "../util/useDoctor";
import usePatient from "../util/usePatient";
import useAppointment from "../util/useAppointment";
import StaffNavigation from "./StaffNavigation";

export default function BookAppointment() {
    const navigate = useNavigate();
    const allowedRole = ['patient', 'receptionist'];
    const userSessionString = sessionStorage.getItem('userSession');
    const userSession = JSON.parse(sessionStorage.getItem('userSession'));

    // if userSession is empty or the role is not the 
    // same to the designated role, go back to login page
    if (!userSessionString) {
        navigate('/');
    } else {
        try {
            // If userSession exists but the role is not the designated role, redirect to the login page
            if (!allowedRole.includes(userSession.role)) navigate('/');
        } catch (error) {
            // If JSON parsing fails, redirect to the login page
            console.error("Failed to parse userSession:", error);
            navigate('/');
        }
    }

    useEffect(() => {
        switch (userSession.role) {
            case 'patient':
                navigate('/hospital/patient/book_appointment');
                break;
            case 'receptionist':
                navigate('/hospital/receptionist/book_appointment');
                break;
            default:
                navigate('/');
                break;
        }
    }, []);

    const [appointmentData, setAppointmentData] = useState({
        patientId: '',
        appointmentDate: '',
        reason: ''
    });
    const [selectedDoctorId, setSelectedDoctorId] = useState(null);
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
                patientId: '',
                appointmentDate: '',
                reason: ''
            });
        }
    }, [hasAppointmentError]);

    function handleOnBookAppointment(doctorId) {
        setSelectedDoctorId(doctorId);
        dialogRef.current.showModal();
    }

    function handleCloseDialog() {
        dialogRef.current.close();
        setSelectedDoctorId(null);
        setAppointmentData({
            patientId: '',
            appointmentDate: '',
            reason: ''
        });
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
            patientId = appointmentData.patientId;
        }

        if ((userSession.role === 'patient' && patient.length !== 0) || userSession.role === 'receptionist') {
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
        <div className="container">
            {(userSession.role === 'patient' && <PatientNavigation />) ||
                (userSession.role === 'receptionist' && <StaffNavigation userRole={userSession.role} />
                )}
            <div>
                <h1 className="lbl">Book Appointment with Doctor</h1>
                {isDoctorLoading || isPatientLoading ? (
                    <p className="norec">Loading doctors list...</p>
                ) : (
                    (!doctors || doctors.length === 0) ? (
                        <p className="norec">There is no doctor</p>
                    ) : (
                        <>
                            <div className="row gy-4" style={{ marginTop: '40px' }}>
                                {doctors.map(doctor => (
                                    <div key={doctor.id} className="col-md-4">
                                        <div className="card " style={{ width: '20rem', height: '15rem' }}>
                                            <div className="card-body ">
                                                <h5 className="card-title fs-5"> DR. {doctor.first_name} {doctor.last_name}</h5>
                                                <h6 className="card-subtitle mb-2 text-body-secondary">specialization : {doctor.specialization}</h6>
                                                <p> License Number : {doctor.license_number}</p>
                                                <p> Contact Number : {doctor.phone}</p>
                                                <button onClick={() => handleOnBookAppointment(doctor.id)} className="btn btn-primary book">Book Appointment</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )
                )}
            </div>
            <dialog ref={dialogRef}>
                <h2>Book Appointment</h2>
                <form onSubmit={handleOnSubmit}>
                    {userSession.role === 'receptionist' &&
                        <>
                            <div className="row mb-4 form-group">
                                <label htmlFor="name" class="col-sm-4 col-form-label">Select a Patient

                                </label>
                                <div class="col-sm-8">
                                    <select
                                        class="form-select"
                                        required
                                        name="patientId"
                                        onChange={handleOnChange}
                                        value={appointmentData.patientId}
                                    >
                                        <option disabled value={''}>Select a Patient</option>
                                        {patients.map(patientMember => (
                                            <option key={patientMember.id} value={patientMember.id}>
                                                {patientMember.first_name} {patientMember.last_name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </>
                    }
                    <div className="row mb-4 form-group">
                        <label htmlFor="appointmentDate" class="col-sm-4 col-form-label">Appointment Date</label>
                        <div class="col-sm-8">
                            <input
                                class="form-control"
                                type="datetime-local"
                                name="appointmentDate"
                                value={appointmentData.appointmentDate}
                                onChange={handleOnChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="row mb-4 form-group">

                        <label htmlFor="reason" class="col-sm-4 col-form-label">Reason</label>
                        <div class="col-sm-8">
                            <input
                                class="form-control"
                                type="text"
                                name="reason"
                                value={appointmentData.reason}
                                onChange={handleOnChange}
                                required
                            />
                        </div>
                    </div>

                    <input
                        class="form-control"
                        id="formbtn"
                        type="submit"
                        value={'Schedule an Appointment'}
                    />


                </form>
                <br />
                <button className="btnback" onClick={handleCloseDialog}>Close</button>
            </dialog>
        </div>
    );
}
