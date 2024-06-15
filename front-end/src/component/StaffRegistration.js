import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useUser from "../util/useUser";

export default function StaffRegistration() {
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('');
    const [password, setPassword] = useState('');
    const { isRegisterSuccess, registerStaff } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (isRegisterSuccess) {
            setName('');
            setEmail('');
            setRole('');
            setPassword('');

            navigate('/');
        }
    }, [isRegisterSuccess]);

    function handleOnInputChange(e) {
        const { name, value } = e.target;

        switch (name) {
            case 'name':
                setName(value);
                break;
            case 'email':
                setEmail(value);
                break;
            case 'role':
                setRole(value);
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

    async function handleOnSubmit(e) {
        e.preventDefault();

        const staff = {
            name: name,
            email: email,
            password: password,
            role: role
        };

        await registerStaff(staff);
    }

    return (
        <div id="form" className="d-flex justify-content-center container-fluid vh-100 ">
            <div className="formcon">
            <h1 className="text-center lblform">Staff Registration</h1>

            <form onSubmit={handleOnSubmit}>
                <div className="row mb-4 form-group">
                    <label htmlFor="name" class="col-sm-2 col-form-label">Name:</label>
                    <div class="col-sm-10">
                        <input
                            type="text"
                            name="name"
                            class="form-control"
                            placeholder="Enter your name"
                            onChange={handleOnInputChange}
                            required
                        /> 
                    </div>
                </div>
                <div className="row mb-4 form-group">
                    <label for="inputEmail3" class="col-sm-2 col-form-label">Email:</label>
                    <div class="col-sm-10">
                        <input
                            className="form-control"
                            type="email" 
                            name="email"
                            placeholder="Enter your email"
                            onChange={handleOnInputChange}
                            required
                        /> 
                    </div>
                </div>
                <div className="row mb-4 form-group">
                    <label htmlFor="name" class="col-sm-2 col-form-label">Role:</label>
                    <div class="col-sm-10">
                        <select  class="form-select" name="role" onChange={handleOnInputChange} value={role}>
                            <option disabled selected value={''}>Select Role</option>
                            <option value={'admin'}>admin</option>
                            <option value={'doctor'}>doctor</option>
                            <option value={'receptionist'}>receptionist</option>
                        </select>
                    </div>
                </div>
                <div className="row mb-4 form-group">
                    <label htmlFor="inputPassword3" className="col-sm-2 col-form-label">Password:</label>
                    <div className="col-sm-10">
                        <div className="input-group">
                            <input
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
                    value={'Register Staff'}
                />
            </form>
            <Link to={'/'}> 
                <div className="d-grid gap-2 d-md-block">
                            <button className="btnback"> &larr; Go Back</button>
                        </div>
            </Link>
            </div>
        </div>
    );
}