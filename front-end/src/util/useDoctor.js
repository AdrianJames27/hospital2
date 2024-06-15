import { useState } from "react";

export default function useDoctor() {
    const [doctors, setDoctors] = useState([]);
    const [doctor, setDoctor] = useState({});
    const [isDoctorLoading, setIsDoctorLoading] = useState(false);
    const [hasDoctorError, setHasDoctorError] = useState(false);

    async function makeApiCall(url, method, body) {
        setIsDoctorLoading(true);

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
            setIsDoctorLoading(false);
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

        setHasDoctorError(true);
    }

    async function showDoctor(email) {
        const url = `http://127.0.0.1:8000/api/doctor/show?email=${encodeURIComponent(email)}`;
        const method = 'GET';

        try {
            const data = await makeApiCall(url, method);

            switch (data.status) {
                case 200:
                    setHasDoctorError(false);
                    setDoctor(data.doctor);
                    break;
                case 404:
                    window.alert(data.message);
                    break;
                default:
                    window.alert('An unexpected error occurred');
                    break;
            }
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    }

    async function fetchDoctors() {
        const url = 'http://127.0.0.1:8000/api/doctor/list';
        const method = 'GET';

        try {
            const data = await makeApiCall(url, method);

            if (data.status === 200) {
                setHasDoctorError(false);
                setDoctors(data.doctors);
            }
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    }

    async function addDoctor(doctor) {
        const url = `http://127.0.0.1:8000/api/doctor/add`;
        const method = 'POST';
        const body = {
            first_name: doctor.firstName,
            last_name: doctor.lastName,
            specialization: doctor.specialization,
            license_number: doctor.licenseNumber,
            phone: doctor.phone,
            email: doctor.email
        };

        try {
            const data = await makeApiCall(url, method, body);

            switch (data.status) {
                case 201:
                    setHasDoctorError(false);
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

    async function updateDoctor(doctor) {
        const url = `http://127.0.0.1:8000/api/doctor/${doctor.id}/edit`;
        const method = 'PUT';
        const body = {
            first_name: doctor.firstName,
            last_name: doctor.lastName,
            specialization: doctor.specialization,
            license_number: doctor.licenseNumber,
            phone: doctor.phone,
            email: doctor.email
        };

        try {
            const data = await makeApiCall(url, method, body);

            switch (data.status) {
                case 200:
                    setHasDoctorError(false);
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

    async function deleteDoctor(id) {
        const url = `http://127.0.0.1:8000/api/doctor/${id}/delete`;
        const method = 'DELETE';

        try {
            const data = await makeApiCall(url, method);

            switch (data.status) {
                case 200:
                    setHasDoctorError(false);
                case 404:
                    window.alert(data.message);
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
        doctors,
        doctor,
        fetchDoctors,
        showDoctor,
        addDoctor,
        updateDoctor,
        deleteDoctor,
        isDoctorLoading,
        hasDoctorError
    };
}