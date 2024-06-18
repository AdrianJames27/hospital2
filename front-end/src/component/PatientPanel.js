import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PatientNavigation from './PatientNavigation';

export default function PatientPanel() {
    const navigate = useNavigate();
    let userSession;

    useEffect(() => {
        userSession = JSON.parse(sessionStorage.getItem('userSession'));

        // if userSession is empty, go back to login page
        if (!userSession) {
            navigate('/hospital');
        } else {
            // if role is not patient, go back to login page
            if (userSession.role !== 'patient') navigate('/hospital');
        }
    }, []);

    return (
        <div class ="dashboard d-flex justify-content-center container-fluid vh-100">
            <PatientNavigation />
            <div>
            <h1 class="welc container-fluid">Welcome {userSession.name}!</h1>
            </div>
        </div>
    );
}