import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useUser from "../util/useUser";

export default function UserLogin() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { isLoginSuccess, loginUser } = useUser();
    const navigate = useNavigate();
    
    useEffect(() => {
        const userSession = JSON.parse(sessionStorage.getItem('userSession'));

        if (!userSession) {
            navigate('/');
        } else {
            if (isLoginSuccess || userSession) {
                switch (userSession.role) {
                    case 'patient':
                        navigate('/hospital/patient/panel');
                        break;
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
                        window.alert('Returning to login page...');
                        navigate('/');
                        break;
                }
            }

            setEmail('');
            setPassword('');
        }
    }, [isLoginSuccess]);
    
    function handleOnInputChange(e) {
        const { name, value } = e.target;

        switch (name) {
            case 'email':
                setEmail(value);
                break;
            case 'password':
                setPassword(value);
                break;
            default:
                console.error('Invalid name attribute');
                break;
        }
    }

    function handleOnShowPassword() {
        setShowPassword(!showPassword);
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const user = {
            email: email, 
            password: password
        };

        await loginUser(user);
    }


    return (
        <div>
            <div>
                <h1>User Login</h1>

                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="text"
                        name="email"
                        placeholder="Enter you email"
                        onChange={handleOnInputChange}
                        required
                    /> <br />
                    <label htmlFor="password">Password:</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Enter your password"
                        onChange={handleOnInputChange}
                        required
                    />
                    <input
                        type="button"
                        value={showPassword ? 'Hide Password' : 'Show Password'}
                        onClick={handleOnShowPassword}
                    /> <br />
                    <input
                        type="submit"
                        value={'Login'}
                    />
                </form>
            </div>
            <div>
                <p>Don't have an account?</p>
                <p>
                    Register as a patient, click{' '}
                    <Link to='/user/patient/register'>here</Link>
                </p>
                <p>
                    Register as a staff, click{' '}
                    <Link to='/user/staff/register'>here</Link>
                </p>
            </div>
        </div>
    );
}