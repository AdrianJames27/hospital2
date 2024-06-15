import { useState } from "react";

export default function useAppointment() {
    const [appointments, setAppointments] = useState([]);
    const [appointment, setAppointment] = useState([]);
    const [isAppointmentLoading, setIsAppointmentLoading] = useState(false);
    const [hasAppointmentError, setHasAppointmentError] = useState(false);

    async function makeApiCall(url, method, body) {
        setIsAppointmentLoading(true);

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
            setIsAppointmentLoading(false);
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

        setHasAppointmentError(true);
    }

    async function fetchAppointments() {
        const url = 'http://127.0.0.1:8000/api/appointment/list';
        const method = 'GET';

        try {
            const data = await makeApiCall(url, method);

            if (data.status === 200) {
                setHasAppointmentError(false);
                setAppointments(data.appointments);
            }
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    }

    async function bookAppointment(appointment) {
        const url = 'http://127.0.0.1:8000/api/appointment/book';
        const method = 'POST';
        const body = {
            patient_id: appointment.patientId,
            doctor_id: appointment.doctorId,
            appointment_date: appointment.appointmentDate,
            status: appointment.status,
            reason: appointment.reason,
        };

        try {
            const data = await makeApiCall(url, method, body);

            switch (data.status) {
                case 201:
                    setHasAppointmentError(false);
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

    async function showAppointment(role, id) {
        let url = `http://127.0.0.1:8000/api/appointment/show`;

        // Check the role and set the appropriate query parameter
        if (role === 'patient') {
            url += `?patient_id=${id}`;
        } else if (role === 'doctor') {
            url += `?doctor_id=${id}`;
        } else {
            console.error('Invalid role');
            return;
        }

        const method = 'GET';

        try {
            const data = await makeApiCall(url, method);

            switch (data.status) {
                case 200:
                    setHasAppointmentError(false);
                    setAppointment(data.appointments);
                    break;
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

    async function updateAppointment(appointment) {
        const url = `http://127.0.0.1:8000/api/appointment/${appointment.id}/edit`;
        const method = 'PUT';
        const body = {
            appointment_date: appointment.appointmentDate,
            status: appointment.status,
            reason: appointment.reason
        };

        try {
            const data = await makeApiCall(url, method, body);

            switch (data.status) {
                case 200:
                    setHasAppointmentError(false);
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

    async function cancelAppointment(id) {
        const url = `http://127.0.0.1:8000/api/appointment/${id}/cancel`;
        const method = 'PUT';

        try {
            const data = await makeApiCall(url, method);

            switch (data.status) {
                case 200:
                    setHasAppointmentError(false);
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
        appointments,
        appointment,
        fetchAppointments,
        bookAppointment,
        showAppointment,
        updateAppointment,
        cancelAppointment,
        isAppointmentLoading,
        hasAppointmentError,
    };
}
