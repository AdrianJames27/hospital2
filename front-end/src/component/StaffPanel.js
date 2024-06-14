import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StaffNavigation from "./StaffNavigation";

export default function StaffPanel() {
    const navigate = useNavigate();
    const allowedRole = ['admin', 'doctor', 'receptionist'];
    const userSessionString = sessionStorage.getItem('userSession');
    const userSession = JSON.parse(sessionStorage.getItem('userSession'));

    // if userSession is empty or the role is not the 
    // same to the designated role, go back to login page
    if (!userSessionString) {
        navigate('/');
    } else {
        try {
            // If userSession exists but the role is not the designated role, redirect to the login page
            if (!allowedRole.includes(userSession.role)) navigate('/');
        } catch (error) {
            // If JSON parsing fails, redirect to the login page
            console.error("Failed to parse userSession:", error);
            navigate('/');
        }
    }

    useEffect(() => {
        switch (userSession.role) {
            case 'admin':
                navigate('/hospital/admin/panel');
                break;
            case 'doctor':
                navigate('/hospital/doctor/panel');
                break;
            case 'receptionist':
                navigate('/hospital/receptionist/panel');
                break;
            default:
                navigate('/');
                break;
        }
    }, []);

    return (
        <div>
            <StaffNavigation userRole={userSession.role} />
            <h1>Welcome {userSession.name}!</h1>
        </div>
    );
}