import React from "react";
import { useNavigate } from "react-router-dom";
import PatientNavigation from './PatientNavigation';

export default function PatientPanel() {
    const navigate = useNavigate();
    const userSession = JSON.parse(sessionStorage.getItem('userSession'));

    // if userSession is empty and role is not admin, go back to login page
    if (!userSession || userSession.role !== 'patient') navigate('/');

    return (
        <div>
            <PatientNavigation />
            <h1>Welcome {userSession.name}!</h1>
        </div>
    );
}