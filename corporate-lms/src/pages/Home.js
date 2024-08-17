import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css'; // Adjust path as necessary

const HomePage = () => {
    return (
        <div className="home-container">
            <h1>Welcome to Our Learning Management System</h1>
            <p>This system provides access to top-quality courses tailored to help you learn at your own pace.</p>
            <Link to="/login">
                <button className="login-button">Login</button>
            </Link>
            <Link to="/register">
                <button className="register-button">Register</button>
            </Link>
        </div>
    );
};

export default HomePage;
