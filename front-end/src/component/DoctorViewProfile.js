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
            <div className="container prof" >
                <h1 className="lblprof">Your Profile</h1>
                <ul class = "list-group ul-prof">
                    <li class="list-group-item u-case"><b>Name:</b> {doctorData.firstName} {doctorData.lastName}</li>
                    <li class="list-group-item u-case"><b>Specialization:</b> {doctorData.specialization}</li>
                    <li class="list-group-item u-case" ><b>License No.</b> {doctorData.licenseNumber}</li>
                    <li class="list-group-item u-case"><b>Phone No.</b> {doctorData.phone}</li>
                    <li class="list-group-item "><span class="u-case"><b>Email:</b></span> {doctorData.email}</li>
                    
                </ul>
                <button class ="edit-prof"onClick={handleOnClickEditProfile}>Edit Profile</button>
                </div>
            </>
        );
    }

    function showEditProfile() {
        return (
            <>
            <div className="container prof">
            <h1 className="lblprof">Your Profile</h1>
                <form onSubmit={handleOnSubmit}>
                <div className="row mb-4 form-group">
                    <label  class="col-sm-2 col-form-label" htmlFor="firstName">First Name:</label>

                    <input
                        class="form-control"
                        type="text"
                        name="firstName"
                        value={doctorData.firstName}
                        onChange={handleOnInputChange}
                        required
                    />
                </div>
                <div className="row mb-4 form-group">
                    <label class="col-sm-2 col-form-label" htmlFor="lastName">Last Name:</label>
                    <input
                        class="form-control"
                        type="text"
                        name="lastName"
                        value={doctorData.lastName}
                        onChange={handleOnInputChange}
                        required
                    />
                </div>
                <div className="row mb-4 form-group">
                    <label class="col-sm-2 col-form-label" htmlFor="specialization">Specialization:</label>
                    <input
                     class="form-control"
                        type="text"
                        name="specialization"
                        value={doctorData.specialization}
                        onChange={handleOnInputChange}
                        required
                    />
                </div>
                <div className="row mb-4 form-group">
                    <label class="col-sm-2 col-form-label" htmlFor="licenseNumber">License Number:</label>
                    <input
                     class="form-control"
                        type="text"
                        name="licenseNumber"
                        value={doctorData.licenseNumber}
                        onChange={handleOnInputChange}
                        required
                    />
                </div>
                <div className="row mb-4 form-group">
                    <label class="col-sm-2 col-form-label" htmlFor="phone">Phone:</label>
                    <input
                     class="form-control"
                        type="text"
                        name="phone"
                        value={doctorData.phone}
                        onChange={handleOnInputChange}
                        required
                    />
                </div>
                <div className="row mb-4 form-group">
                    <label class="col-sm-2 col-form-label" htmlFor="email">Email:</label>
                    <input
                     class="form-control"
                        type="email"
                        name="email"
                        value={doctorData.email}
                        onChange={handleOnInputChange}
                        required
                    /> 
                </div>
                    
                    <input
                        className="btn-save"
                        type="submit"
                        value={'Save Profile'}
                    />
                    <input
                        className="btn-cancel"
                        type="button"
                        value={'Cancel'}
                        onClick={handleOnClickCancel}
                    />
                </form>
            </div>
            </>
        );
    }

    return (
        <div>
            <StaffNavigation userRole={userSession.role} />
            <h1>Your Profile</h1>
            {isDoctorLoading ? (
                <p className="norec">Loading profile...</p>
            ) : (
                !doctor || doctor.length === 0 ? (
                    <p className="norec">You don't have a record yet</p>
                ) : (manageView())
            )}
        </div>
    );
}