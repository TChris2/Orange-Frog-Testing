import React, { useState } from "react";
import './loginstyle.css';  
import logo from './images/orange-frog-logo.png';

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const [form, setForm] = useState({ email: '', password: '' });
    const [emailError, setEmailError] = useState('');

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    const submit = (e) => {
        e.preventDefault();
        // Handle form submission logic here
    };

    return (
        <div className="wrapper">
            <div className="login-box">
                <form onSubmit={submit}>
                    <div className="flex justify-center mb-6">
                        <div className="rounded-full bg-white shadow-lg w-36 h-36 flex items-center justify-center">
                            <img 
                                src={logo} 
                                alt="Logo" 
                                className="w-24 h-28"
                            />
                        </div>
                    </div>
                    <h2>Login</h2>

                    <div className="input-box">
                        <span className="icon">
                            <ion-icon name="mail"></ion-icon>
                        </span>
                        <input 
                            type="email" 
                            value={form.email} 
                            onChange={handleInputChange} 
                            name="email"
                            required 
                        />
                        <label>Email</label>
                    </div>

                    <div className="input-box">
                        <span className="icon" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                            <ion-icon name={showPassword ? "eye-off" : "eye"}></ion-icon>
                        </span>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            value={form.password} 
                            onChange={handleInputChange} 
                            name="password"
                            required 
                        />
                        <label>Password</label>
                    </div>

                    <div className="remember-forgot">
                        <label>
                            <input type="checkbox" /> Remember me
                        </label>
                        <a href="#">Forgot Password?</a>
                    </div>

                    <button type="submit">Login</button>

                    <div className="register-link">
                        <p>Don't have an account? <a href="#">Register</a></p>
                    </div>
                </form>
            </div>
        </div>
    );
}
