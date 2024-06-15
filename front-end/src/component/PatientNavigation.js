import { Link, useNavigate } from "react-router-dom";

export default function PatientNavigation() {
    const navigate = useNavigate();

    function handleOnClickLogout() {
        const response = window.confirm('Are you sure to logout?');

        if (response) {
            sessionStorage.removeItem('userSession');
            navigate('/');
        }
    }

    return (
        <div>
            <nav>
                <ul>
                    <li>
                        <Link to={'/hospital/patient/panel'}>
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link to={'/hospital/patient/book_appointment'}>
                            Book Appointment
                        </Link>
                    </li>
                    <li>
                        <Link to="/hospital/patient/manage_appointments">
                            Manage Appointments
                        </Link>
                    </li>
                    <li>
                        <Link to={'/hospital/patient/view_medical_records'}>
                            View Medical Records
                        </Link>
                    </li>
                    <li>
                        <button onClick={handleOnClickLogout}>Logout</button>
                    </li>
                </ul>
            </nav>
        </div>
    );
}