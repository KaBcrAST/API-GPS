import React, { useState } from 'react';
import axios from 'axios';
import './Login.css'; // Assurez-vous de créer ce fichier CSS pour la mise en page

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/login', formData);
            console.log(res.data);
        } catch (err) {
            console.error(err.response.data);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:5000/auth/google';
    };

    return (
        <form onSubmit={onSubmit} className="login-form">
            <h2 className="login-title">Login</h2>
            <div className="form-group">
                <label>Email</label>
                <input type="email" name="email" value={email} onChange={onChange} required />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input type="password" name="password" value={password} onChange={onChange} required />
            </div>
            <button type="submit" className="btn btn-primary">Login</button>
            <button type="button" className="btn btn-secondary" onClick={handleGoogleLogin}>Login with Google</button>
            <a href="http://localhost:5000/api/auth/facebook" className="btn btn-facebook">Login with Facebook</a>
        </form>
    );
};

export default Login;