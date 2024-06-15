import { useState } from "react";

export default function useMedicalRecord() {
    const [medicalRecords, setMedicalRecords] = useState([]);
    const [medicalRecord, setMedicalRecord] = useState([]);
    const [isMedicalRecordLoading, setIsMedicalRecordLoading] = useState(false);
    const [hasMedicalRecordError, setHasMedicalRecordError] = useState(false);

    async function makeApiCall(url, method, body) {
        setIsMedicalRecordLoading(true);

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
            throw error;
        } finally {
            setIsMedicalRecordLoading(false);
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

        setHasMedicalRecordError(true);
    }

    async function fetchMedicalRecords() {
        const url = 'http://127.0.0.1:8000/api/medicalRecord/list';
        const method = 'GET';

        try {
            const data = await makeApiCall(url, method);

            if (data.status === 200) {
                setHasMedicalRecordError(false);
                setMedicalRecords(data.medicalRecords);
            }
        } catch (error) {
            console.error(`Error: ${error}`);
        }
    }

    async function addMedicalRecord(medicalRecord) {
        const url = 'http://127.0.0.1:8000/api/medicalRecord/add';
        const method = 'POST';
        const body = {
            patient_id: medicalRecord.patientId,
            doctor_id: medicalRecord.doctorId,
            visit_date: medicalRecord.visitDate,
            diagnosis: medicalRecord.diagnosis,
            treatment: medicalRecord.treatment,
            notes: medicalRecord.notes,
        };

        try {
            const data = await makeApiCall(url, method, body);

            switch (data.status) {
                case 201:
                    setHasMedicalRecordError(false);
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

    async function showMedicalRecords(patient_id) {
        const url = `http://127.0.0.1:8000/api/medicalRecord/${patient_id}/show`;
        const method = 'GET';

        try {
            const data = await makeApiCall(url, method);

            switch (data.status) {
                case 200:
                    setHasMedicalRecordError(false);
                    setMedicalRecord(data.medicalRecords);
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

    async function updateMedicalRecord(medicalRecord) {
        const url = `http://127.0.0.1:8000/api/medicalRecord/${medicalRecord.id}/edit`;
        const method = 'PUT';
        const body = {
            patient_id: medicalRecord.patientId,
            doctor_id: medicalRecord.doctorId,
            visit_date: medicalRecord.visitDate,
            diagnosis: medicalRecord.diagnosis,
            treatment: medicalRecord.treatment,
            notes: medicalRecord.notes,
        };

        try {
            const data = await makeApiCall(url, method, body);

            switch (data.status) {
                case 200:
                    setHasMedicalRecordError(false);
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
        medicalRecords,
        medicalRecord,
        fetchMedicalRecords,
        addMedicalRecord,
        showMedicalRecords,
        updateMedicalRecord,
        isMedicalRecordLoading,
        hasMedicalRecordError,
    };
}
