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
            <nav className="navbar fixed-top">
                <div className="container-fluid" >
                    <ul className="nav nav-underline">
                        <li className="nav-item">
                            <Link to={'/hospital/receptionist/panel'} className="nav-link">
                                Dashboard
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to={'/hospital/receptionist/manage_patient_records'} className="nav-link">
                                Manage Patient Records
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to={'/hospital/receptionist/book_appointment'} className="nav-link">
                                Book Appointment
                            </Link>
                        </li>
                            
                    </ul>
                   
                         <button onClick={handleOnClickLogout} id="logout" className='btn btn-primary '>Logout</button>
                          
                </div>
            </nav>
        );
    }

    function navigationForDoctor() {
        return (
            <nav className="navbar fixed-top">
                    <div className="container-fluid" >
                    <ul className="nav nav-underline">
                        <li className="nav-item">
                            <Link to={'/hospital/doctor/panel'} className="nav-link">
                                Dashboard
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to={'/hospital/doctor/profile'} className="nav-link">
                                View Profile
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to={'/hospital/doctor/manage_patient_records'} className="nav-link">
                                Manage Patient Records
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to={'/hospital/doctor/manage_medical_records'} className="nav-link">
                                Manage Medical Records
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link to={'/hospital/doctor/manage_appointments'} className="nav-link">
                                Manage Appointments
                            </Link>
                        </li>
                        </ul>
                   
                         <button onClick={handleOnClickLogout} id="logout" className='btn btn-primary '>Logout

                         </button>
                </div>
            </nav>
        );
    }

    function navigationForAdmin() {
        return (
            <nav className="navbar fixed-top">
                <div className="container-fluid" >
                    <ul className="nav nav-underline">
                        <li className="nav-item" >
                            <Link to={'/hospital/admin/panel'} className="nav-link">
                                Dashboard
                            </Link>
                        </li>
                        <li className="nav-item" >
                            <Link to={'/hospital/admin/view_appointments'} className="nav-link">
                                View Appoiment Records
                            </Link>
                        </li>
                        <li className="nav-item" >
                            <Link to={'/hospital/admin/view_medical_records'} className="nav-link">
                                View Medical Records
                            </Link>
                        </li>
                        <li className="nav-item" >
                            <Link to={'/hospital/admin/manage_user'} className="nav-link">
                                Manage Users
                            </Link>
                        </li>
                        <li className="nav-item" >
                            <Link to={'/hospital/admin/manage_doctors'} className="nav-link">
                                Manage Doctors
                            </Link>
                        </li>
                        <li className="nav-item" >
                            <Link to={'/hospital/admin/manage_patient_records'} className="nav-link">
                                Manage Patient Records
                            </Link>
                        </li>
                       </ul>
                   
                         <button onClick={handleOnClickLogout} id="logout" className='btn btn-primary '>Logout</button>
                </div>
            </nav>
        );
    }

    return <div>{manageNavigation()}</div>;
}