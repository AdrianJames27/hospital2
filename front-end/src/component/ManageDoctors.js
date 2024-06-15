import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useDoctor from "../util/useDoctor"; // Import the custom hook for managing doctors
import StaffNavigation from "./StaffNavigation";

export default function ManageDoctors() {
    const navigate = useNavigate();
    const userSession = JSON.parse(sessionStorage.getItem('userSession'));

    // if role is not admin, go back to login page
    if (userSession.role !== 'admin') navigate('/');

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
        <div >
            <StaffNavigation userRole={userSession.role} />
            <div className="container doc-man">
            <h1 class="lbl">Manage Doctors</h1>
            <div>
                <form onSubmit={handleOnSubmit}>
                <div className="row mb-4 form-group">
                        <label htmlFor="firstName" class="col-sm-2 col-form-label">First Name:</label>
                        <div class="col-sm-10">
                            <input
                             class="form-control"
                                type="text"
                                name="firstName"
                                value={doctorData.firstName}
                                onChange={handleOnInputChange}
                                required
                            />
                        </div>
                </div>
                <div className="row mb-4 form-group">
                        <label class="col-sm-2 col-form-label"htmlFor="lastName">Last Name:</label>
                        <div class="col-sm-10">
                            <input
                             class="form-control"
                                type="text"
                                name="lastName"
                                value={doctorData.lastName}
                                onChange={handleOnInputChange}
                                required
                            />
                        </div>
                </div>
                <div className="row mb-4 form-group">
                        <label class="col-sm-2 col-form-label"htmlFor="specialization">Specialization:</label>

                        <div class="col-sm-10">
                            <input
                             class="form-control"
                                type="text"
                                name="specialization"
                                value={doctorData.specialization}
                                onChange={handleOnInputChange}
                                required
                            />
                        </div>
                </div>
                <div className="row mb-4 form-group">
                        <label class="col-sm-2 col-form-label" htmlFor="licenseNumber">License Number:</label>
                        <div class="col-sm-10">
                            <input
                             class="form-control"
                                type="text"
                                name="licenseNumber"
                                value={doctorData.licenseNumber}
                                onChange={handleOnInputChange}
                                required
                            />
                        </div>
                </div>
                <div className="row mb-4 form-group">
                        <label class="col-sm-2 col-form-label" htmlFor="phone">Phone:</label>
                        <div class="col-sm-10">
                            <input
                             class="form-control"
                                type="text"
                                name="phone"
                                value={doctorData.phone}
                                onChange={handleOnInputChange}
                                required
                            />
                        </div>
                </div>
                <div className="row mb-4 form-group">
                        <label class="col-sm-2 col-form-label" htmlFor="email">Email:</label>
                        <div class="col-sm-10">
                            <input
                             class="form-control"
                                type="email"
                                name="email"
                                value={doctorData.email}
                                onChange={handleOnInputChange}
                                required
                            />
                        </div>
                </div>
                <div class = "upbtncon">
                        
                        <button type="submit" class="
                     btn-save">{isEditing ? 'Update Doctor' : 'Add Doctor'}</button>
                        {
                            isEditing &&
                            <input
                                class="btn-cancel"
                                type="button"
                                value={'Cancel'}
                                onClick={handleOnClickCancel}
                            />
                        }
                    </div>
                </form>
            </div>
            <div>
                <h1 class="lbl">Doctor List</h1>
                {isDoctorLoading ? (
                    <p className="norec">Loading doctors...</p>
                ) : (
                    (!doctors || doctors.length === 0) ? (
                        <p className="norec">Doctor list is empty</p>
                    ) : (
                        <div>
                            <table class="table table-striped table-color">
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
                                                <button
                                                class = "edit" onClick={() => handleOnEditDoctor(doctor)}>Edit</button>
                                                <button
                                                class = "delete"  onClick={() => handleOnDeleteDoctor(doctor.id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )
                )}
            </div>
        </div>
        </div>
    );
}