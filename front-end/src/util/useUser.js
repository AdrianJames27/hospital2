import { useState } from "react";

export default function useUser() {
    const [isLoginSuccess, setIsLoginSuccess] = useState(false);
    const [isRegisterSuccess, setIsRegisterSuccess] = useState(false);
    const [hasUserError, setHasUserError] = useState(false);
    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [receptionists, setReceptionists] = useState([]);
    const [isUserLoading, setIsUserLoading] = useState(false);

    async function makeApiCall(url, method, body) {
        setIsUserLoading(true);

        // contains method, header, body, etc. of the request
        let initObject = {};

        switch (arguments.length) {
            case 2:
                initObject = {
                    method: method,
                    headers: { 'Content-Type': 'application/json' }
                }
                break;
            case 3:
                initObject = {
                    method: method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                }
                break;
            default:
                throw new Error('Invalid number of arguments');
        }

        try {
            const response = await fetch(url, initObject);

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            return response.json();
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
            throw error; // Propagate the error to the caller
        } finally {
            setIsUserLoading(false);
        }
    }

    function handleValidationErrors(data) {
        if (data.errors) {
            let errorMessage = 'Validation errors:';

            for (const field in data.errors) {
                errorMessage += `\n${field}: ${data.errors[field]}`;
            }

            window.alert(errorMessage);
        }

        if (data.message) {
            window.alert(data.message);
        }

        setHasUserError(true);
    }

    async function registerPatient(patient) {
        const url = 'http://127.0.0.1:8000/api/user/add';
        const method = 'POST';
        const body = {
            name: patient.name,
            email: patient.email,
            password: patient.password,
            role: 'patient'
        };

        try {
            const data = await makeApiCall(url, method, body);

            switch (data.status) {
                case 201:
                    setIsRegisterSuccess(true);
                    setHasUserError(false);
                    window.alert(data.message);
                    break;
                case 422:
                    handleValidationErrors(data);
                    break;
                default:
                    window.alert('An unexpected error occurred');
                    break;
            }
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    }

    async function registerStaff(staff) {
        const url = 'http://127.0.0.1:8000/api/user/add';
        const method = 'POST';
        const body = {
            name: staff.name,
            email: staff.email,
            password: staff.password,
            role: staff.role
        };

        try {
            const data = await makeApiCall(url, method, body);

            switch (data.status) {
                case 201:
                    setIsRegisterSuccess(true);
                    setHasUserError(false);
                    window.alert(data.message);
                    break;
                case 422:
                    handleValidationErrors(data);
                    break;
                default:
                    window.alert('An unexpected error occurred');
                    break;
            }
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    }

    async function loginUser(user) {
        const url = 'http://127.0.0.1:8000/api/user/login';
        const method = 'POST';
        const body = {
            email: user.email,
            password: user.password
        };

        try {
            const data = await makeApiCall(url, method, body);

            switch (data.status) {
                case 200:
                    sessionStorage.setItem('userSession', JSON.stringify(data.user));
                    setIsLoginSuccess(true);
                    setHasUserError(false);
                    window.alert(data.message);
                    break;
                case 422:
                    handleValidationErrors(data);
                    break;
                default:
                    window.alert('An unexpected error occurred');
                    break;
            }
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    }

    async function fetchPatients() {
        const url = 'http://127.0.0.1:8000/api/user/patient/list';
        const method = 'GET';

        try {
            const data = await makeApiCall(url, method);

            if (data.status === 200) {
                setHasUserError(false);
                setPatients(data.patients);
            }
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    }

    async function fetchDoctors() {
        const url = 'http://127.0.0.1:8000/api/user/doctor/list';
        const method = 'GET';

        try {
            const data = await makeApiCall(url, method);

            if (data.status === 200) {
                setHasUserError(false);
                setDoctors(data.doctors);
            }
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    }

    async function fetchReceptionists() {
        const url = 'http://127.0.0.1:8000/api/user/receptionist/list';
        const method = 'GET';

        try {
            const data = await makeApiCall(url, method);

            if (data.status === 200) {
                setHasUserError(false);
                setReceptionists(data.receptionists);
            }
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    }

    async function addUser(user) {
        const url = `http://127.0.0.1:8000/api/user/add`;
        const method = 'POST';
        const body = {
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role
        };

        try {
            const data = await makeApiCall(url, method, body);

            switch (data.status) {
                case 201:
                    setHasUserError(false);
                    window.alert(data.message);
                    break;
                case 422:
                    handleValidationErrors(data);
                    break;
                default:
                    window.alert('An unexpected error occurred');
                    break;
            }
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    }

    async function updateUser(user) {
        const url = `http://127.0.0.1:8000/api/user/${user.id}/edit`;
        const method = 'PUT';
        const body = {
            name: user.name,
            email: user.email,
            password: user.password,
            role: user.role
        };

        try {
            const data = await makeApiCall(url, method, body);

            switch (data.status) {
                case 200:
                    setHasUserError(false);
                case 404:
                    window.alert(data.message);
                    break;
                case 422:
                    handleValidationErrors(data);
                    break;
                default:
                    window.alert('An unexpected error occurred');
                    break;
            }
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    }

    async function deleteUser(id) {
        const url = `http://127.0.0.1:8000/api/user/${id}/delete`;
        const method = 'DELETE';

        try {
            const data = await makeApiCall(url, method);

            switch (data.status) {
                case 200:
                    setHasUserError(false);
                case 404:
                    window.alert(data.message);
                    break;
                case 422:
                    handleValidationErrors(data);
                    break;
                default:
                    window.alert('An unexpected error occurred');
                    break;
            }
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    }

    return {
        registerPatient,
        registerStaff,
        isRegisterSuccess,
        loginUser,
        isLoginSuccess,
        fetchPatients,
        patients,
        fetchDoctors,
        doctors,
        fetchReceptionists,
        receptionists,
        addUser,
        updateUser,
        deleteUser,
        hasUserError,
        isUserLoading
    };
}