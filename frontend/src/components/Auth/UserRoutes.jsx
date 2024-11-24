import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const UserRoutes = () => {
    const isAuthenticated = !!localStorage.getItem('token');
    return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}

export default UserRoutes;
