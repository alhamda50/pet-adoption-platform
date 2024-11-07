import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const UserRoutes = () => {
    const token = localStorage.getItem('token');
    const isAuthenticated = token ? true : false;
    return isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}

export default UserRoutes;
