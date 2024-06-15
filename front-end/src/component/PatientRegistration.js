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
        
            <div id="form" className="d-flex justify-content-center container-fluid vh-100 ">
            <div className="formcon " id="logincon">
            <h1 className="text-center lblform prlbl">Patient Registration</h1>

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
                        type="email" 
                        class="form-control" id="inputEmail3"
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
                    value={'Register Patient'}
                />
            </form>
            <Link to={'/'}> <div className="d-grid gap-2 d-md-block">
                            <button className="btnback"> &larr; Go Back</button>
                        </div></Link>
        </div>
        </div>
    );
}