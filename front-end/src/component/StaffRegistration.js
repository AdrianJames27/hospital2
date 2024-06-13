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
        <div>
            <h1>Staff Registration</h1>

            <form onSubmit={handleOnSubmit}>
                <label htmlFor="name">Name:</label>
                <input
                    type="text"
                    name="name"
                    placeholder="Enter your name"
                    onChange={handleOnInputChange}
                    required
                /> <br/>
                <label htmlFor="email">Email:</label>
                <input
                    type="text"
                    name="email"
                    placeholder="Enter your email"
                    onChange={handleOnInputChange}
                    required
                /> <br/>
                <label htmlFor="role">Role:</label>
                <select name="role" onChange={handleOnInputChange} value={role}>
                    <option disabled selected value={''}>Select Role</option>
                    <option value={'admin'}>admin</option>
                    <option value={'doctor'}>doctor</option>
                    <option value={'receptionist'}>receptionist</option>
                </select> <br/>
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
                    onClick={handleOnShowPassword}
                    value={showPassword ? 'Hide Password' : 'Show Password'}
                /> <br/>
                <input
                    type="submit"
                    value={'Register Staff'}
                />
            </form>
            <Link to={'/'}>Go Back</Link>
        </div>
    );
}