import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosinterceptor';
import './Profile.css';

const Profile = () => {
    const [user, setUser] = useState(null);
    const [postsCount, setPostsCount] = useState(0);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        axiosInstance.get('/user/profile')  // Ensure '/user/profile' is the correct endpoint
          .then(response => {
            setUser(response.data.user);
            setPostsCount(response.data.postsCount);
          })
          .catch(err => {
            setError('Unable to load profile information');
            console.error('Error:', err.response ? err.response.data : err.message);
          });
      }, []);
    const handlePostNewAdoption = () => {
        // Assuming the post was created successfully, we manually update the post count
        setPostsCount(postsCount + 1);
        navigate('/add');
    };

    const handleManageAdoptions = () => {
        navigate('/manage');  // Navigate to the page that displays user's posts
    };

    if (error) return <p>{error}</p>;

    return user ? (
        <div className="profile">
            <div className="profile-info">
                <h2>My Profile</h2>
                <p><strong>Username:</strong> {user.username}</p>
                <p><strong>Email:</strong> {user.userEmail}</p>
                <p><strong>Phone:</strong> {user.phone}</p>
                <button onClick={handleManageAdoptions}>Manage Adoptions</button> <br />
                <button onClick={handlePostNewAdoption}>Post New Adoption</button>
                 
            </div>
        </div>
    ) : (
        <p>Loading profile...</p>
    );
};

export default Profile;
