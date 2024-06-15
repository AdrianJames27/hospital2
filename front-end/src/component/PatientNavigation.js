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
            <nav className="navbar fixed-top">
            <div className="container-fluid" >
             <ul className="nav nav-underline">
                    <li className="nav-item">
                        <Link className="nav-link" to={'/hospital/patient/panel'}>
                            Dashboard
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to={'/hospital/patient/book_appointment'}>
                            Book Appointment
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to={"/hospital/patient/manage_appointments"}>
                            Manage Appointments
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to={'/hospital/patient/view_medical_records'}>
                            View Medical Records
                        </Link>
                    </li>
                    
                </ul>
                <button onClick={handleOnClickLogout} id="logout" className='btn btn-primary '>Logout</button>
            </div>
            </nav>
        </div>
    );
}