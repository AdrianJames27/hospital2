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
        <div id="form" className="d-flex justify-content-center container-fluid vh-100 ">
            <div className="formcon " id="logincon">
                <h1 className="text-center lblform prlbl">Login</h1>

                <form onSubmit={handleSubmit}>
                    <div className="row mb-4 form-group">
                        <label for="inputEmail3" class="col-sm-2 col-form-label">Email:</label>
                            <div class="col-sm-10">
                                <input
                                type="email" class="form-control" id="inputEmail3"
                                name="email"
                                placeholder="Enter you email"
                                onChange={handleOnInputChange}
                                required
                            />
                            </div>
                    </div>
                    
                    <div className="row mb-4 form-group">
                        <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Password:</label>
                        <div className="col-sm-10">
                            <div className="input-group">
                                <input
                                    id="txtpass"
                                    className="form-control rounded"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    placeholder="Enter your password"
                                    onChange={handleOnInputChange}
                                    required
                                />
                                <button className="btn btn-outline-secondary" type="button" onClick={handleOnShowPassword}>
                                    {showPassword ? 'Hide Password' : 'Show Password'}
                                </button>
                            </div>
                        </div>
                    </div>

                    
                    <input
                     class="form-control"
                     id="formbtn"
                        type="submit"
                        value={'Login'}
                    />
                </form>

                <div className="reginfocon text-center ">
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
        </div>
    );
}