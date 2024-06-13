import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useUser from "../util/useUser";

export default function PatientRegistration() {
    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { isRegisterSuccess, registerPatient } = useUser();
    const navigate = useNavigate();

    useEffect(() => {
        if (isRegisterSuccess) {
            setName('');
            setEmail('');
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

        const patient = {
            name: name,
            email: email,
            password: password
        };

        await registerPatient(patient);
    }

    return (
        <div>
            <h1>Patient Registration</h1>

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
                    value={'Register Patient'}
                />
            </form>
            <Link to={'/'}>Go Back</Link>
        </div>
    );
}