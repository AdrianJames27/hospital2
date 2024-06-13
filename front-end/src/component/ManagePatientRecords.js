import { useNavigate } from "react-router-dom";
import usePatient from "../util/usePatient";
import { useState, useEffect } from "react";
import StaffNavigation from "./StaffNavigation";

export default function ManagePatientRecords() {
    const navigate = useNavigate();
    const userSession = JSON.parse(sessionStorage.getItem('userSession'));
    const allowedUser = ['admin', 'doctor', 'receptionist'];

    // if userSession is empty or role is not any of the allowedUser, go back to login page
    if (!userSession || !allowedUser.includes(userSession.role)) navigate('/');

    const {
        isPatientLoading,
        hasPatientError,
        patients,
        addPatient,
        updatePatient,
        deletePatient,
        fetchPatients
    } = usePatient();

    const [isEditing, setIsEditing] = useState(false);
    const [patientData, setPatientData] = useState({
        id: '',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: '',
        address: '',
        phone: '',
        email: '',
        emergencyContact: '',
        medicalHistory: ''
    });

    const genderList = ['Male', 'Female', 'Other'];

    useEffect(() => {
        async function fetchData() {
            await fetchPatients();
        }

        fetchData();
    }, []);

    useEffect(() => {
        // if the process has no validation error
        if (!hasPatientError) {
            setPatientData({
                id: '',
                firstName: '',
                lastName: '',
                dateOfBirth: '',
                gender: '',
                address: '',
                phone: '',
                email: '',
                emergencyContact: '',
                medicalHistory: ''
            });

            setIsEditing(false);
        }
    }, [patients]);

    function handleOnChangeInput(e) {
        const { name, value } = e.target;
        setPatientData({ ...patientData, [name]: value });
    }

    async function handleOnSubmit(e) {
        e.preventDefault();

        const patient = {
            id: patientData.id,
            firstName: patientData.firstName,
            lastName: patientData.lastName,
            dateOfBirth: patientData.dateOfBirth,
            gender: patientData.gender,
            address: patientData.address,
            phone: patientData.phone,
            email: patientData.email,
            emergencyContact: patientData.emergencyContact,
            medicalHistory: patientData.medicalHistory
        };

        if (isEditing) {
            await updatePatient(patient);
        } else {
            await addPatient(patient);
        }

        await fetchPatients();
    }

    function handleOnEdit(patient) {
        setPatientData({
            id: patient.id,
            firstName: patient.first_name,
            lastName: patient.last_name,
            dateOfBirth: patient.date_of_birth,
            gender: patient.gender,
            address: patient.address,
            phone: patient.phone,
            email: patient.email,
            emergencyContact: patient.emergency_contact,
            medicalHistory: patient.medical_history
        });

        setIsEditing(true);
    }

    async function handleOnDelete(id) {
        const response = window.confirm('Are you sure to remove?');

        if (response) {
            await deletePatient(id);
            await fetchPatients();
        }
    }

    function handleOnClickCancel() {
        setPatientData({
            id: '',
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            gender: '',
            address: '',
            phone: '',
            email: '',
            emergencyContact: '',
            medicalHistory: ''
        });

        setIsEditing(false);
    }

    return (
        <div>
            <StaffNavigation userRole={userSession.role} />
            <h1>Manage Patient Records</h1>
            <div>
                <form onSubmit={handleOnSubmit}>
                    <label htmlFor="firstName">First Name:</label>
                    <input
                        type="text"
                        name="firstName"
                        placeholder="Enter your first name"
                        value={patientData.firstName}
                        onChange={handleOnChangeInput}
                        required
                        disabled={userSession.role === 'doctor' && !isEditing}
                    /> <br />
                    <label htmlFor="lastName">Last Name:</label>
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Enter your last name"
                        value={patientData.lastName}
                        onChange={handleOnChangeInput}
                        required
                        disabled={userSession.role === 'doctor' && !isEditing}
                    /> <br />
                    <label htmlFor="dateOfBirth">Date of Birth:</label>
                    <input
                        type="date"
                        name="dateOfBirth"
                        placeholder="Enter your birthdate"
                        value={patientData.dateOfBirth}
                        onChange={handleOnChangeInput}
                        required
                        disabled={userSession.role === 'doctor' && !isEditing}
                    /> <br />
                    <label htmlFor="gender">Gender</label>
                    <select
                        required
                        name="gender"
                        value={patientData.gender}
                        onChange={handleOnChangeInput}
                        disabled={userSession.role === 'doctor' && !isEditing}
                    >
                        <option disabled value={''}>Select Gender:</option>
                        {genderList.map((gender, index) => (
                            <option key={index} value={gender}>{gender}</option>
                        ))}
                    </select> <br />
                    <label htmlFor="address">Address:</label>
                    <input
                        type="text"
                        name="address"
                        placeholder="Enter your address"
                        value={patientData.address}
                        onChange={handleOnChangeInput}
                        required
                        disabled={userSession.role === 'doctor' && !isEditing}
                    /> <br />
                    <label htmlFor="phone">Phone:</label>
                    <input
                        type="text"
                        name="phone"
                        placeholder="Enter your phone number"
                        value={patientData.phone}
                        onChange={handleOnChangeInput}
                        required
                        disabled={userSession.role === 'doctor' && !isEditing}
                    /> <br />
                    <label htmlFor="email">Email:</label>
                    <input
                        type="text"
                        name="email"
                        placeholder="Enter your email"
                        value={patientData.email}
                        onChange={handleOnChangeInput}
                        required
                        disabled={userSession.role === 'doctor' && !isEditing}
                    /> <br />
                    <label htmlFor="emergencyContact">Emergency Contact:</label>
                    <input
                        type="text"
                        name="emergencyContact"
                        placeholder="Enter your emergency contact"
                        value={patientData.emergencyContact}
                        onChange={handleOnChangeInput}
                        required
                        disabled={userSession.role === 'doctor' && !isEditing}
                    /> <br />
                    <label htmlFor="medicalHistory">Medical History:</label>
                    <input
                        type="text"
                        name="medicalHistory"
                        placeholder="Enter your medical history"
                        value={patientData.medicalHistory}
                        onChange={handleOnChangeInput}
                        required
                        disabled={userSession.role === 'doctor' && !isEditing}
                    /> <br />
                    {(userSession.role === 'admin' || userSession.role === 'receptionist' || isEditing) && (
                        <input
                            type="submit"
                            value={isEditing ? 'Update Patient Record' : 'Add Patient Record'}
                        />
                    )}
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
                {isPatientLoading ? (
                    <p>Loading Patient Record...</p>
                ) : (
                    (!patients || patients.length === 0) ? (
                        <p>Patient Record is empty</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Patient Name</th>
                                    <th>Date Of Birth</th>
                                    <th>Gender</th>
                                    <th>Address</th>
                                    <th>Phone</th>
                                    <th>Email</th>
                                    <th>Emergency Contact</th>
                                    <th>Medical History</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {patients.map(patient => (
                                    <tr key={patient.id}>
                                        <td>{patient.first_name} {patient.last_name}</td>
                                        <td>{patient.date_of_birth}</td>
                                        <td>{patient.gender}</td>
                                        <td>{patient.address}</td>
                                        <td>{patient.phone}</td>
                                        <td>{patient.email}</td>
                                        <td>{patient.emergency_contact}</td>
                                        <td>{patient.medical_history}</td>
                                        <td>
                                            <button onClick={() => handleOnEdit(patient)}>Edit</button>
                                            {userSession.role === 'admin' && (
                                                <button onClick={() => handleOnDelete(patient.id)}>Delete</button>
                                            )}
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
