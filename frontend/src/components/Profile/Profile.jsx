import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosinterceptor';
import './Profile.css'

const Profile = () => {
    const [user, setUser] = useState(null);
    const [postsCount, setPostsCount] = useState(0);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        axiosInstance.get('/user/profile')
            .then(response => {
                setUser(response.data.user);
                setPostsCount(response.data.postsCount);
            })
            .catch(err => {
                setError('Unable to load profile information');
                console.error('Error:', err.response ? err.response.data : err.message);
            });
    }, []);

    if (error) return <p>{error}</p>;

    return user ? (
        <div className="profile">
            <div className="profile-info">
                <h2>{user.username}'s Profile</h2>
                <p><strong>Email:</strong> {user.userEmail}</p>
                <p><strong>Phone:</strong> {user.phone}</p>
                <p><strong>Number of Posts:</strong> {postsCount}</p>
                <Link to='/add'>
                    <button onClick={() => navigate('/add')}>Post New Adoption</button>
                </Link>
            </div>
        </div>
    ) : (
        <p>Loading profile...</p>
    );
};

export default Profile;
