import React from "react";
import { useNavigate } from "react-router-dom";
import PatientNavigation from './PatientNavigation';

export default function PatientPanel() {
    const navigate = useNavigate();
    const userSession = JSON.parse(sessionStorage.getItem('userSession'));

    // if role is not patient, go back to login page
    useEffec
    if (userSession.role !== 'patient') navigate('/hospital');

    return (
        <div class ="dashboard d-flex justify-content-center container-fluid vh-100">
            <PatientNavigation />
            <div>
            <h1 class="welc container-fluid">Welcome {userSession.name}!</h1>
            </div>
        </div>
    );
}