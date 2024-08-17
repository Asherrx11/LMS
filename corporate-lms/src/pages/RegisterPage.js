import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/RegisterPage.css';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [grade, setGrade] = useState('');
    const [role, setRole] = useState('student'); // default to 'student'
    const navigate = useNavigate();

    const handleRegister = async () => {
        let processedGrade = grade;
        if (role !== 'admin' && grade !== '') {
            processedGrade = Number(grade); // Convert to number if grade is provided
        } else if (role !== 'admin' && grade === '') {
            processedGrade = null; // Set to null if grade is empty and role is not admin
        } else {
            processedGrade = null; // Ensure grade is null for admin role
        }

        const userDetails = {
            username,
            email,
            password,
            role,
            grade: processedGrade
        };

        console.log("User details being sent:", userDetails); // Debug log

        try {
            const response = await fetch('http://localhost:5000/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userDetails)
            });

            if (!response.ok) {
                const data = await response.json();
                console.error('Registration failed', data.message);
                return;
            }

            const data = await response.json();
            console.log('Registration successful', data);
            navigate('/login');
        } catch (error) {
            console.error('Error during registration:', error);
        }
    };

    return (
        <div className="register-container">
            <h1>Register</h1>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" />
            <select value={role} onChange={e => setRole(e.target.value)}>
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
                <option value="admin">Admin</option>
            </select>
            {role !== 'admin' && (
                <input type="number" value={grade} onChange={e => setGrade(e.target.value)} placeholder="Grade" />
            )}
            <button onClick={handleRegister}>Register</button>
        </div>
    );
};

export default RegisterPage;
