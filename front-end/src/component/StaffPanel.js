import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StaffNavigation from "./StaffNavigation";

export default function StaffPanel() {
    const navigate = useNavigate();
    const allowedRole = ['admin', 'doctor', 'receptionist'];
    const userSession = JSON.parse(sessionStorage.getItem('userSession'));

    // if role is not included in the allowedRole, go back to login page
    if (!allowedRole.includes(userSession.role)) navigate('/');

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
        <div class ="dashboard d-flex justify-content-center container-fluid vh-100">
            <StaffNavigation userRole={userSession.role} />
            <div>
                <h1 class="welc container-fluid" >Welcome {userSession.name}!</h1>
            </div>
        </div>
    );
}