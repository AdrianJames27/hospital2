import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useDoctor from "../util/useDoctor"; // Import the custom hook for managing doctors
import StaffNavigation from "./StaffNavigation";

export default function ManageDoctors() {
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
        doctors,
        fetchDoctors,
        addDoctor,
        updateDoctor,
        deleteDoctor,
        isDoctorLoading,
        hasDoctorError
    } = useDoctor(); // Use the custom hook for managing doctors
    const [isEditing, setIsEditing] = useState(false);
    const [doctorData, setDoctorData] = useState({
        id: '',
        firstName: '',
        lastName: '',
        specialization: '',
        licenseNumber: '',
        phone: '',
        email: ''
    });

    useEffect(() => {
        async function fetchData() {
            fetchDoctors(); // Fetch doctors on component mount
        }

        fetchData();
    }, []);

    useEffect(() => {
        // if the process has no validation error
        if (!hasDoctorError) {
            setDoctorData({
                id: '',
                firstName: '',
                lastName: '',
                specialization: '',
                licenseNumber: '',
                phone: '',
                email: ''
            });

            setIsEditing(false);
        }
    }, [doctors]);

    function handleOnInputChange(e) {
        const { name, value } = e.target;
        setDoctorData({ ...doctorData, [name]: value });
    }

    async function handleOnSubmit(e) {
        e.preventDefault();

        const doctor = {
            id: doctorData.id,
            firstName: doctorData.firstName,
            lastName: doctorData.lastName,
            specialization: doctorData.specialization,
            licenseNumber: doctorData.licenseNumber,
            phone: doctorData.phone,
            email: doctorData.email
        };

        // update doctor
        if (isEditing) {
            await updateDoctor(doctor);
        }
        // add doctor
        else {
            await addDoctor(doctor);
        }

        await fetchDoctors();
    }

    async function handleOnEditDoctor(doctor) {
        setDoctorData({
            id: doctor.id,
            firstName: doctor.first_name,
            lastName: doctor.last_name,
            specialization: doctor.specialization,
            licenseNumber: doctor.license_number,
            phone: doctor.phone,
            email: doctor.email
        });
        setIsEditing(true);
    }

    async function handleOnDeleteDoctor(id) {
        const response = window.confirm('Are you sure you want to delete this doctor?');

        if (response) {
            await deleteDoctor(id);
            await fetchDoctors();
        }
    }

    function handleOnClickCancel() {
        setDoctorData({
            id: '',
            firstName: '',
            lastName: '',
            specialization: '',
            licenseNumber: '',
            phone: '',
            email: ''
        });

        setIsEditing(false);
    }

    return (
        <div>
            <StaffNavigation userRole={userSession.role} />
            <h1>Manage Doctors</h1>
            <div>
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
                    /><br />
                    <label htmlFor="licenseNumber">License Number:</label>
                    <input
                        type="text"
                        name="licenseNumber"
                        value={doctorData.licenseNumber}
                        onChange={handleOnInputChange}
                        required
                    /><br />
                    <label htmlFor="phone">Phone:</label>
                    <input
                        type="text"
                        name="phone"
                        value={doctorData.phone}
                        onChange={handleOnInputChange}
                        required
                    /><br />
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={doctorData.email}
                        onChange={handleOnInputChange}
                        required
                    /><br />
                    <button type="submit">{isEditing ? 'Update Doctor' : 'Add Doctor'}</button>
                    {
                        isEditing &&
                        <input
                            type="button"
                            value={'Cancel'}
                            onClick={handleOnClickCancel}
                        />
                    }
                </form>
            </div>
            <div>
                {isDoctorLoading ? (
                    <p>Loading doctors...</p>
                ) : (
                    (!doctors || doctors.length === 0) ? (
                        <p>Doctor list is empty</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Doctor Name</th>
                                    <th>Specialization</th>
                                    <th>License No.</th>
                                    <th>Phone No.</th>
                                    <th>Email</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {doctors.map(doctor => (
                                    <tr key={doctor.id}>
                                        <td>{doctor.first_name} {doctor.last_name}</td>
                                        <td>{doctor.specialization}</td>
                                        <td>{doctor.license_number}</td>
                                        <td>{doctor.phone}</td>
                                        <td>{doctor.email}</td>
                                        <td>
                                            <button onClick={() => handleOnEditDoctor(doctor)}>Edit</button>
                                            <button onClick={() => handleOnDeleteDoctor(doctor.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )
                )}
            </div>
        </div>
    );
}