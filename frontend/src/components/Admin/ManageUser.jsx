import React, { useState, useEffect } from "react";
import axiosInstance from "../../axiosinterceptor";
import { Link } from "react-router-dom";
import './CSS/ManageUser.css'; // Ensure this path is correct

const ManageUser = () => {
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Fetch all users
    axiosInstance.get('/user/')
      .then(response => {
        console.log("Users fetched:", response.data);
        if (response.data && Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          setErrorMessage("Error fetching users data.");
        }
      })
      .catch(err => {
        console.error("Error fetching users:", err);
        setErrorMessage("Error fetching users data.");
      });
  }, []);

  const handleDeleteUser = (id) => {
    axiosInstance.delete(`/user/delete/${id}`)
      .then(() => {
        setUsers(users.filter(user => user._id !== id)); // Remove user from UI
        alert('User deleted');
      })
      .catch(err => console.error("Error deleting user:", err));
  };

  return (
    <div className="manage-users">
      <h2>Manage Users</h2>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users.length > 0 ? (
              users.map(user => (
                <tr key={user._id}>
                  <td>{user.username}</td>
                  <td>{user.userEmail}</td>
                  <td>{user.phone}</td>
                  <td>{user.role}</td>
                  <td className="action-buttons">
                    <div className="button-container">
                      <Link to={`/manage-user/edit-user/${user._id}`} className="edit-btn">Edit</Link>
                      <button className="deleteBtn" onClick={() => handleDeleteUser(user._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">No users available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ManageUser;
