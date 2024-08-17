import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Correct import for jwt-decode

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        const decodedToken = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            return <Navigate to="/login" replace />;
        }
    } catch (error) {
        localStorage.removeItem('token');
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default PrivateRoute;
