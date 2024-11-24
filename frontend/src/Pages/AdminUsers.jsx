import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token'); // Assuming the token is stored in localStorage
                const response = await axios.get('/admin/users', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div>
            <h1>Manage Users</h1>
            <table>
                <thead>
                    <tr>
                        <th>Email</th>
                        <th>Username</th>
                        <th>Role</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td>{user.userEmail}</td>
                            <td>{user.username}</td>
                            <td>{user.role}</td>
                            <td>
                                <button onClick={() => /* Update Role Logic */ null}>Edit</button>
                                <button onClick={() => /* Delete User Logic */ null}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminUsers;
