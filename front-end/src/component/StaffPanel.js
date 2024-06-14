import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StaffNavigation from "./StaffNavigation";

export default function StaffPanel() {
    const navigate = useNavigate();
    const allowedRole = ['admin', 'doctor', 'receptionist'];
    const userSession = JSON.parse(sessionStorage.getItem('userSession'));

    // if userSession is empty and role is not admin, go back to login page
    if (!userSession || !allowedRole.includes(userSession.role)) navigate('/');

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