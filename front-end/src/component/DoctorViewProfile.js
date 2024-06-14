import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import StaffNavigation from "./StaffNavigation";
import useDoctor from "../util/useDoctor";

export default function DoctorViewProfile() {
    const navigate = useNavigate();
    const userSession = JSON.parse(sessionStorage.getItem('userSession'));

    // if role is not doctor, go back to login page
    if (userSession.role !== 'doctor') navigate('/');

    const [doctorData, setDoctorData] = useState({
        doctorId: '',
        firstName: '',
        lastName: '',
        specialization: '',
        licenseNumber: '',
        phone: '',
        email: ''
    });
    const [mode, setMode] = useState('View');
    const {
        hasDoctorError,
        isDoctorLoading,
        doctor,
        showDoctor,
        updateDoctor
    } = useDoctor();

    useEffect(() => {
        async function fetchData() {
            await showDoctor(userSession.email);
        }

        fetchData();
    }, []);

    useEffect(() => {
        if (doctor && doctor.length > 0) {
            defaultData();
        }
    }, [doctor]);

    useEffect(() => {
        if (!hasDoctorError) {
            setMode('View');
        }
    }, [doctor]);

    function defaultData() {
        const [{
            id,
            first_name,
            last_name,
            specialization,
            license_number,
            phone,
            email
        }] = doctor;

        setDoctorData({
            doctorId: id,
            firstName: first_name,
            lastName: last_name,
            specialization: specialization,
            licenseNumber: license_number,
            phone: phone,
            email: email
        });
    }

    function handleOnClickEditProfile() {
        setMode('Edit');
        manageView();
    }

    async function handleOnSubmit(e) {
        e.preventDefault();

        const doctor = {
            id: doctorData.doctorId,
            firstName: doctorData.firstName,
            lastName: doctorData.lastName,
            specialization: doctorData.specialization,
            licenseNumber: doctorData.licenseNumber,
            phone: doctorData.phone,
            email: doctorData.email
        };

        await updateDoctor(doctor);
        await showDoctor(userSession.email);
    }

    function handleOnInputChange(e) {
        const { name, value } = e.target;
        setDoctorData({ ...doctorData, [name]: value });
    }

    function handleOnClickCancel() {
        defaultData();
        setMode('View');
        manageView();
    }

    function manageView() {
        if (mode === 'View') {
            return showProfile();
        } else {
            return showEditProfile();
        }
    }

    function showProfile() {
        return (
            <>
                <p>Doctor ID: {doctorData.doctorId}</p>
                <p>Name: {doctorData.firstName} {doctorData.lastName}</p>
                <p>Specialization: {doctorData.specialization}</p>
                <p>License No. {doctorData.licenseNumber}</p>
                <p>Phone No. {doctorData.phone}</p>
                <p>Email: {doctorData.email}</p>
                <br />
                <button onClick={handleOnClickEditProfile}>Edit Profile</button>
            </>
        );
    }

    function showEditProfile() {
        return (
            <>
                <form onSubmit={handleOnSubmit}>
                    <label htmlFor="firstName">First Name:</label>
                    <input
                        type="text"
                        name="firstName"
                        value={doctorData.firstName}
                        onChange={handleOnInputChange}
                        required
                    /><br />
                    <label htmlFor="lastName">Last Name:</label>
                    <input
                        type="text"
                        name="lastName"
                        value={doctorData.lastName}
                        onChange={handleOnInputChange}
                        required
                    /><br />
                    <label htmlFor="specialization">Specialization:</label>
                    <input
                        type="text"
                        name="specialization"
                        value={doctorData.specialization}
                        onChange={handleOnInputChange}
                        required
                    /> <br />
                    <label htmlFor="licenseNumber">License Number:</label>
                    <input
                        type="text"
                        name="licenseNumber"
                        value={doctorData.licenseNumber}
                        onChange={handleOnInputChange}
                        required
                    /> <br />
                    <label htmlFor="phone">Phone:</label>
                    <input
                        type="text"
                        name="phone"
                        value={doctorData.phone}
                        onChange={handleOnInputChange}
                        required
                    /> <br />
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={doctorData.email}
                        onChange={handleOnInputChange}
                        required
                    /> <br />
                    <input
                        type="submit"
                        value={'Save Profile'}
                    />
                    <input
                        type="button"
                        value={'Cancel'}
                        onClick={handleOnClickCancel}
                    />
                </form>
            </>
        );
    }

    return (
        <div>
            <StaffNavigation userRole={userSession.role} />
            <h1>Your Profile</h1>
            {isDoctorLoading ? (
                <p>Loading profile...</p>
            ) : (
                !doctor || doctor.length === 0 ? (
                    <p>You don't have a record yet</p>
                ) : (manageView())
            )}
        </div>
    );
}