import React from "react";
import { useNavigate } from "react-router-dom";
import StaffNavigation from "./StaffNavigation";

export default function StaffPanel() {
    const navigate = useNavigate();
    const userSession = JSON.parse(sessionStorage.getItem('userSession'));

    // if userSession is empty and role is not admin, go back to login page
    if (!userSession && userSession.role !== 'admin') navigate('/');

    return (
        <div>
            <StaffNavigation userRole={userSession.role} />
            <h1>Welcome {userSession.name}!</h1>
        </div>
    );
}