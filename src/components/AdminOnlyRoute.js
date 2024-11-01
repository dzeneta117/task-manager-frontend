// src/components/AdminOnlyRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const AdminOnlyRoute = ({ children }) => {
    const role = localStorage.getItem('role');
    
    if (role !== 'admin') {
        // Ako korisnik nije admin, preusmerava na stranicu sa greškom ili na drugu stranicu
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

export default AdminOnlyRoute;
