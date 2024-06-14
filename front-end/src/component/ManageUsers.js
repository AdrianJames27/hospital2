import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useUser from "../util/useUser";
import StaffNavigation from "./StaffNavigation";

export default function ManageUser() {
    const navigate = useNavigate();
    const userSession = JSON.parse(sessionStorage.getItem('userSession'));

    // if userSession is empty and role is not admin, go back to login page
    if (!userSession && userSession.role !== 'admin') navigate('/');

    const [selectedUser, setSelectedUser] = useState(''); // Manage selected user type
    const {
        isUserLoading,
        hasUserError,
        patients,
        doctors,
        receptionists,
        fetchPatients,
        fetchDoctors,
        fetchReceptionists,
        addUser,
        updateUser,
        deleteUser
    } = useUser();
    const [showPassword, setShowPassword] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({
        id: '',
        name: '',
        email: '',
        password: '',
        role: ''
    });
    const definedRoles = ['patient', 'doctor', 'receptionist'];

    useEffect(() => {
        async function fetchDatas() {
            await fetchPatients();
            await fetchDoctors();
            await fetchReceptionists();
        }

        fetchDatas();
    }, [])

    useEffect(() => {
        // if the process has no validation error
        if (!hasUserError) {
            setUserData({
                id: '',
                name: '',
                email: '',
                password: '',
                role: ''
            });

            setIsEditing(false);
        }
    }, [patients, doctors, receptionists]);

    useEffect(() => {
        setSelectedUser(!selectedUser ? 'Patients' : selectedUser);

        setUserData({
            id: '',
            name: '',
            email: '',
            password: '',
            role: selectedUser.substring(0, selectedUser.length - 1).toLowerCase()
        });

        setIsEditing(false);
    }, [selectedUser, patients, doctors, receptionists]);

    function handleOnClickUser(e) {
        e.preventDefault();
        setSelectedUser(e.target.innerText); // Update state with the clicked user type
    }

    function renderContent() {
        switch (selectedUser) {
            case 'Patients':
                return displayUserAs(patients);
            case 'Doctors':
                return displayUserAs(doctors);
            case 'Receptionists':
                return displayUserAs(receptionists);
            default:
                return <p>Please select a user type.</p>; // Default message
        }
    }

    function handleOnInputChange(e) {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    }

    function handleOnShowPassword() {
        setShowPassword(!showPassword);
    }

    async function handleOnSubmit(e) {
        e.preventDefault();

        const user = {
            id: userData.id,
            name: userData.name,
            email: userData.email,
            password: !userData.password ? '' : userData.password,
            role: userData.role
        };

        // update user
        if (isEditing) {
            await updateUser(user);
        }
        // add user
        else {
            await addUser(user);
        }

        switch (selectedUser) {
            case 'Patients':
                await fetchPatients();
                break;
            case 'Doctors':
                await fetchDoctors();
                break;
            case 'Receptionists':
                await fetchReceptionists();
                break;
        }
    }

    async function handleOnEditUser(user) {
        setUserData({
            id: user.id,
            name: user.name,
            email: user.email,
            password: '',
            role: user.role
        });
        setIsEditing(true);
    }

    async function handleOnDeleteUser(id) {
        const response = window.confirm('Are you sure to remove?');

        if (response) {
            await deleteUser(id);

            switch (selectedUser) {
                case 'Patients':
                    await fetchPatients();
                    break;
                case 'Doctors':
                    await fetchDoctors();
                    break;
                case 'Receptionists':
                    await fetchReceptionists();
                    break;
            }
        }
    }

    function handleOnClickCancel() {
        setUserData({
            id: '',
            name: '',
            email: '',
            password: '',
            role: ''
        });
        setIsEditing(false);
    }

    function displayUserAs(userList) {
        return (
            <>
                <h3>{selectedUser}</h3>
                <div>
                    <form onSubmit={handleOnSubmit}>
                        <label htmlFor="name">Name:</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            onChange={handleOnInputChange}
                            value={userData.name}
                            required
                        /> <br />
                        <label htmlFor="email">Email:</label>
                        <input
                            type="text"
                            name="email"
                            placeholder="Enter your email"
                            onChange={handleOnInputChange}
                            value={userData.email}
                            required
                        /> <br />
                        <label htmlFor="role">Role:</label>
                        {isEditing ? (
                            <select name="role" onChange={handleOnInputChange} value={userData.role}>
                                <option disabled value={''}>Select Role</option>
                                {
                                    definedRoles.map((definedRole, index) => {
                                        return <option key={index} value={definedRole}>{definedRole}</option>;
                                    })
                                }
                            </select>
                        ) : (
                            <select name="role" disabled onChange={handleOnInputChange} value={userData.role}>
                                {definedRoles.map((definedRole, index) => {
                                    if (definedRole === userData.role) {
                                        return <option key={index} value={definedRole}>{definedRole}</option>;
                                    }
                                })}
                            </select>
                        )} <br />
                        <label htmlFor="password">Password:</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            placeholder="Enter your password"
                            onChange={handleOnInputChange}
                            value={userData.password}
                        />
                        <input
                            type="button"
                            onClick={handleOnShowPassword}
                            value={showPassword ? 'Hide Password' : 'Show Password'}
                        /> <br />
                        <input
                            type="submit"
                            value={isEditing ? `Update ${selectedUser.substring(0, selectedUser.length - 1)}`
                                : `Add ${selectedUser.substring(0, selectedUser.length - 1)}`}
                        />
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
                    <h2>{selectedUser.substring(0, selectedUser.length - 1)} List</h2>
                    {isUserLoading ? (
                        <p>Loading {selectedUser}...</p>
                    ) : (
                        (!userList || userList.length === 0) ? (
                            <p>{selectedUser} list is empty</p>
                        ) : (
                            <table>
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Role</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {userList.map(user => {
                                        return (
                                            <tr key={user.id}>
                                                <td>{user.name}</td>
                                                <td>{user.email}</td>
                                                <td>{user.role}</td>
                                                <td>
                                                    <button onClick={() => handleOnEditUser(user)}>Edit</button>
                                                    <button onClick={() => handleOnDeleteUser(user.id)}>Delete</button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )
                    )}
                </div>
            </>
        );
    }

    return (
        <div>
            <StaffNavigation userRole={userSession.role} />
            <h1>Manage Users</h1>
            <div>
                <ul>
                    <li>
                        <a href="#" onClick={handleOnClickUser}>Patients</a>
                    </li>
                    <li>
                        <a href="#" onClick={handleOnClickUser}>Doctors</a>
                    </li>
                    <li>
                        <a href="#" onClick={handleOnClickUser}>Receptionists</a>
                    </li>
                </ul>
            </div>
            <div>
                {renderContent()}
            </div>
        </div>
    );
}