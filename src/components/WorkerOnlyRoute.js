// src/components/WorkerOnlyRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const WorkerOnlyRoute = ({ children }) => {
    const role = localStorage.getItem('role');
    
    if (role !== 'worker') {
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

export default WorkerOnlyRoute;

