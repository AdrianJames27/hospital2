import { Link, useNavigate } from "react-router-dom";

export default function StaffNavigation({ userRole }) {
    const navigate = useNavigate();

    function handleOnClickLogout() {
        const response = window.confirm('Are you sure to logout?');

        if (response) {
            sessionStorage.removeItem('userSession');
            navigate('/');
        }
    }

    function manageNavigation() {
        const staffRole = userRole;

        switch (staffRole) {
            case 'admin':
                return navigationForAdmin();
            case 'doctor':
                return navigationForDoctor();
            case 'receptionist':
                return navigationForReceptionist();
            default:
                console.error('An unexpected error occured');
                break;
        }
    }

    function navigationForReceptionist() {
        return (
            <nav>
                <ul>
                    <li>
                        <Link to={'/hospital/receptionist/panel'}>
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link to={'/hospital/receptionist/manage_patient_records'}>
                            Manage Patient Records
                        </Link>
                    </li>
                    <li>
                        <Link to={'/hospital/receptionist/book_appointment'}>
                            Book Appointment
                        </Link>
                    </li>
                    <li>
                        <button onClick={handleOnClickLogout}>Logout</button>
                    </li>
                </ul>
            </nav>
        );
    }

    function navigationForDoctor() {
        return (
            <nav>
                <ul>
                    <li>
                        <Link to={'/hospital/doctor/panel'}>
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link to={'/hospital/doctor/profile'}>
                            View Profile
                        </Link>
                    </li>
                    <li>
                        <Link to={'/hospital/doctor/manage_patient_records'}>
                            Manage Patient Records
                        </Link>
                    </li>
                    <li>
                        <Link to={'/hospital/doctor/manage_medical_records'}>
                            Manage Medical Records
                        </Link>
                    </li>
                    <li>
                        <Link to={'/hospital/doctor/manage_appointments'}>
                            Manage Appointments
                        </Link>
                    </li>
                    <li>
                        <button onClick={handleOnClickLogout}>Logout</button>
                    </li>
                </ul>
            </nav>
        );
    }

    function navigationForAdmin() {
        return (
            <nav>
                <ul>
                    <li>
                        <Link to={'/hospital/admin/panel'}>
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link to={'/hospital/admin/view_appointments'}>
                            View Appoiment Records
                        </Link>
                    </li>
                    <li>
                        <Link to={'/hospital/admin/view_medical_records'}>
                            View Medical Records
                        </Link>
                    </li>
                    <li>
                        <Link to={'/hospital/admin/manage_user'}>
                            Manage Users
                        </Link>
                    </li>
                    <li>
                        <Link to={'/hospital/admin/manage_doctors'}>
                            Manage Doctors
                        </Link>
                    </li>
                    <li>
                        <Link to={'/hospital/admin/manage_patient_records'}>
                            Manage Patient Records
                        </Link>
                    </li>
                    <li>
                        <button onClick={handleOnClickLogout}>Logout</button>
                    </li>
                </ul>
            </nav>
        );
    }

    return <div>{manageNavigation()}</div>;
}