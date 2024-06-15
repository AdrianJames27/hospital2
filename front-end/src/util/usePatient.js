import { useState } from "react";

export default function usePatient() {
    const [patients, setPatients] = useState([]);
    const [patient, setPatient] = useState({});
    const [isPatientLoading, setIsPatientLoading] = useState(false);
    const [hasPatientError, setHasPatientError] = useState(false);

    async function makeApiCall(url, method, body) {
        setIsPatientLoading(true);

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
            setIsPatientLoading(false);
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

        setHasPatientError(true);
    }

    async function showPatient(email) {
        const url = `http://127.0.0.1:8000/api/patient/show?email=${encodeURIComponent(email)}`;
        const method = 'GET';

        try {
            const data = await makeApiCall(url, method);

            switch (data.status) {
                case 200:
                    setHasPatientError(false);
                    setPatient(data.patient);
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

    async function fetchPatients() {
        const url = 'http://127.0.0.1:8000/api/patient/list';
        const method = 'GET';

        try {
            const data = await makeApiCall(url, method);

            if (data.status === 200) {
                setHasPatientError(false);
                setPatients(data.patients);
            }
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    }

    async function addPatient(patient) {
        const url = `http://127.0.0.1:8000/api/patient/add`;
        const method = 'POST';
        const body = {
            first_name: patient.firstName,
            last_name: patient.lastName,
            date_of_birth: patient.dateOfBirth,
            gender: patient.gender,
            address: patient.address,
            phone: patient.phone,
            email: patient.email,
            emergency_contact: patient.emergencyContact,
            medical_history: patient.medicalHistory
        };

        try {
            const data = await makeApiCall(url, method, body);

            switch (data.status) {
                case 201:
                    setHasPatientError(false);
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

    async function updatePatient(patient) {
        const url = `http://127.0.0.1:8000/api/patient/${patient.id}/edit`;
        const method = 'PUT';
        const body = {
            first_name: patient.firstName,
            last_name: patient.lastName,
            date_of_birth: patient.dateOfBirth,
            gender: patient.gender,
            address: patient.address,
            phone: patient.phone,
            email: patient.email,
            emergency_contact: patient.emergencyContact,
            medical_history: patient.medicalHistory
        };

        try {
            const data = await makeApiCall(url, method, body);

            switch (data.status) {
                case 200:
                    setHasPatientError(false);
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

    async function deletePatient(id) {
        const url = `http://127.0.0.1:8000/api/patient/${id}/delete`;
        const method = 'DELETE';

        try {
            const data = await makeApiCall(url, method);

            switch (data.status) {
                case 200:
                    setHasPatientError(false);
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
        patient,
        patients,
        fetchPatients,
        showPatient,
        addPatient,
        updatePatient,
        deletePatient,
        isPatientLoading,
        hasPatientError
    };
}