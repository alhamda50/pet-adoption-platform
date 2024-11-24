// AdminDashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './CSS/AdminDashboard.css'

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <div className="buttons">
        <Link to="/manage-pets">
          <button className="manage-btn">Manage Adoptions</button>
        </Link>
        <Link to="/manage-users">
          <button className="manage-btn">Manage Users</button>
        </Link>
      </div>
    </div> 
  );
};

export default AdminDashboard;
