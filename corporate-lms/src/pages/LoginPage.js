import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/LoginPage.css'; 

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const validateEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    const handleLogin = async () => {
        if (!email) {
            setError('Email is required');
            return;
        }
        if (!validateEmail(email)) {
            setError('Invalid email address');
            return;
        }
        if (!password) {
            setError('Password is required');
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (response.ok) {
                console.log('Login successful', data);
                localStorage.setItem('token', data.token); // Save the token
                if (data.role === 'admin') {
                    navigate('/admin'); // Navigate to AdminDashboard
                } else {
                    navigate('/courses'); // Navigate to Course List
                }
            } else {
                console.error('Login failed', data.message);
                setError(data.message);
            }
        } catch (error) {
            console.error('Error during login:', error);
            setError('An error occurred during login');
        }
    };

    return (
        <div className="login-container">
            <h1>Login</h1>
            <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                placeholder="Email" 
                className="login-input"
            />
            <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                placeholder="Password" 
                className="login-input"
            />
            <button onClick={handleLogin} className="login-button">Login</button>
            {error && <p className="error-message">{error}</p>}
            <p className="register-link">
                New here? <Link to="/register">Please register</Link>
            </p>
        </div>
    );
};

export default LoginPage;
