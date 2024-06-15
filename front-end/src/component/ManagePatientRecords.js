import { useNavigate } from "react-router-dom";
import usePatient from "../util/usePatient";
import { useState, useEffect } from "react";
import StaffNavigation from "./StaffNavigation";

export default function ManagePatientRecords() {
    const navigate = useNavigate();
    const allowedUser = ['admin', 'doctor', 'receptionist'];
    const userSession = JSON.parse(sessionStorage.getItem('userSession'));

    // if role is not any of the allowedUser, go back to login page
    if (!allowedUser.includes(userSession.role)) navigate('/');

    useEffect(() => {
        switch (userSession.role) {
            case 'admin':
                navigate('/hospital/admin/manage_patient_records');
                break;
            case 'doctor':
                navigate('/hospital/doctor/manage_patient_records');
                break;
            case 'receptionist':
                navigate('/hospital/receptionist/manage_patient_records');
                break;
            default:
                navigate('/');
                break;
        }
    }, []);

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
        <div className='container'>
            <StaffNavigation userRole={userSession.role} />
            <h1 className='lbl'>Manage Patient Records</h1>
            <div>
                <form onSubmit={handleOnSubmit}>
                <div className="row mb-4 form-group">
                    
                    <label htmlFor="name" class="col-sm-2 col-form-label">First Name:</label>
                       <div class="col-sm-10">
                            <input 
                                    class="form-control"
                                    type="text"
                                    name="firstName"
                                    placeholder="Enter your first name"
                                    value={patientData.firstName}
                                    onChange={handleOnChangeInput}
                                    required
                                    disabled={userSession.role === 'doctor' && !isEditing}
                                /> 
                        </div>
                        
                </div>
                <div className="row mb-4 form-group">
                    <label htmlFor="lastName" class="col-sm-2 col-form-label">Last Name:</label>
                    <div class="col-sm-10">
                        <input
                            type="text"
                            name="lastName"
                            className="form-control"
                            placeholder="Enter your last name"
                            value={patientData.lastName}
                            onChange={handleOnChangeInput}
                            required
                            disabled={userSession.role === 'doctor' && !isEditing}
                        /> 
                    </div>
                </div>
                <div className="row mb-4 form-group">
                    <label htmlFor="dateOfBirth " class="col-sm-2 col-form-label">Date of Birth:</label>
                    <div class="col-sm-10">
                        <input
                        className="form-control"
                            type="date"
                            name="dateOfBirth"
                            placeholder="Enter your birthdate"
                            value={patientData.dateOfBirth}
                            onChange={handleOnChangeInput}
                            required
                            disabled={userSession.role === 'doctor' && !isEditing}
                        /> 
                    </div>
                </div>
                <div className="row mb-4 form-group">
                    <label htmlFor="gender" class="col-sm-2 col-form-label">Gender</label>
                    <div class="col-sm-10">
                        <select
                             class="form-select"
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
                        </select> 
                    </div>
                </div>
                <div className="row mb-4 form-group">
                    <label htmlFor="address" class="col-sm-2 col-form-label">Address:</label>
                    <div class="col-sm-10">
                        <input
                            className="form-control"
                            type="text"
                            name="address"
                            placeholder="Enter your address"
                            value={patientData.address}
                            onChange={handleOnChangeInput}
                            required
                            disabled={userSession.role === 'doctor' && !isEditing}
                        />
                    </div>
                </div>
                <div className="row mb-4 form-group">
                    <label htmlFor="phone" class="col-sm-2 col-form-label">Phone:</label>
                    <div class="col-sm-10">
                        <input
                            className="form-control"
                            type="text"
                            name="phone"
                            placeholder="Enter your phone number"
                            value={patientData.phone}
                            onChange={handleOnChangeInput}
                            required
                            disabled={userSession.role === 'doctor' && !isEditing}
                        /> 
                    </div>
                </div>
                <div className="row mb-4 form-group">
                    <label htmlFor="email" class="col-sm-2 col-form-label">Email:</label>
                    <div class="col-sm-10">
                        <input
                        className="form-control"
                            type="text"
                            name="email"
                            placeholder="Enter your email"
                            value={patientData.email}
                            onChange={handleOnChangeInput}
                            required
                            disabled={userSession.role === 'doctor' && !isEditing}
                        /> 
                    </div>
                </div>
                < div className="row mb-4 form-group">
                    <label htmlFor="emergencyContact" class="col-sm-2 col-form-label">Emergency Contact:</label>
                    <div class="col-sm-10">
                        <input
                            className="form-control"
                            type="text"
                            name="emergencyContact"
                            placeholder="Enter your emergency contact"
                            value={patientData.emergencyContact}
                            onChange={handleOnChangeInput}
                            required
                            disabled={userSession.role === 'doctor' && !isEditing}
                        />
                    </div>
                </div>
                <div className="row mb-4 form-group">
                    <label htmlFor="medicalHistory" class="col-sm-2 col-form-label">Medical History:</label>
                    <div class="col-sm-10">
                        <input
                        class="form-control"
                            type="text"
                            name="medicalHistory"
                            placeholder="Enter your medical history"
                            value={patientData.medicalHistory}
                            onChange={handleOnChangeInput}
                            required
                            disabled={userSession.role === 'doctor' && !isEditing}
                        /> 
                    </div>
                </div>
                <div class = "upbtncon">
                    {(userSession.role === 'admin' || userSession.role === 'receptionist' || isEditing) && (
                        <input
                        class="btn-save"
                            type="submit"
                            value={isEditing ? 'Update Patient Record' : 'Add Patient Record'}
                        />
                    )}
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
                <h1 className="lbl">Patient Record List</h1>
                {isPatientLoading ? (
                    <p className="norec">Loading patient records...</p>
                ) : (
                    (!patients || patients.length === 0) ? (
                        <p className="norec">Patient record list is empty</p>
                    ) : (
                    <div className="table-responsive">
                        <table class="table table-striped table-color">
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
                                            <button className = "edit" onClick={() => handleOnEdit(patient)}>Edit</button>
                                            {userSession.role === 'admin' && (
                                                <button
                                                className = "delete" onClick={() => handleOnDelete(patient.id)}>Delete</button>
                                            )}
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
    );
}
