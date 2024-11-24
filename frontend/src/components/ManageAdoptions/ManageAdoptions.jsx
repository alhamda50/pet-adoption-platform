// ManageAdoptions.jsx
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axiosinterceptor';
import './ManageAdoptions.css';
import { useNavigate } from 'react-router-dom';

const decodeJWT = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const decodedData = atob(base64);
    return JSON.parse(decodedData);
};

const ManageAdoptions = () => {
    const [pets, setPets] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserPosts = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setError('No authentication token found. Please log in.');
                setLoading(false);
                return;
            }
            try {
                const decodedToken = decodeJWT(token);
                const userId = decodedToken._id;
                const currentTime = Date.now() / 1000;
                if (decodedToken.exp < currentTime) {
                    setError('Session expired. Please log in again.');
                    localStorage.removeItem('token');
                    setLoading(false);
                    return;
                }
                const response = await axiosInstance.get('/user/pets', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { owner_id: userId }
                });

                if (response.data && response.data.pets) {
                    setPets(response.data.pets);
                } else {
                    setPets([]);
                    setError('No pets available or incorrect API response.');
                }
                setLoading(false);
            } catch (err) {
                console.error('Fetch error details:', err);
                if (err.response) {
                    setError(`Error ${err.response.status}: ${err.response.data.message || 'Unable to load your adoption posts'}`);
                } else if (err.request) {
                    setError('No response from server. Check network or API endpoint.');
                } else {
                    setError(`Unexpected error: ${err.message}`);
                }
                setLoading(false);
            }
        };

        fetchUserPosts();
    }, []);

    const handleDelete = (petId) => {
        axiosInstance.delete(`http://localhost:3000/pet/remove/${petId}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }).then(() => {
            alert('Pet deleted');
            window.location.reload();
        }).catch((error) => {
            console.log(error);
            alert('Failed to delete pet');
        });
    };

    const handleEditClick = (pet) => {
        navigate(`/edit-pet/${pet._id}`, { state: { pet } });
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div className="manage-adoptions">
            <h2>Manage Your Adoptions</h2>
            {pets.length === 0 ? (
                <p>You haven't posted any adoptions yet.</p>
            ) : (
                <div className="posts-list">
                    {pets.map((pet) => (
                        <div key={pet._id} className="post-card">
                            <div className="post-header">
                                <h4>{pet.name}</h4>
                                
                            </div>
                            <div className="post-images">
                                {pet.media && pet.media.length > 0 ? (
                                    pet.media.map((image, index) => (
                                        <img
                                            key={index}
                                            src={`http://localhost:3000/${image}`}
                                            alt={`${pet.name} ${index + 1}`}
                                        />
                                    ))
                                ) : (
                                    <img
                                        src="/path/to/default-media.jpg"
                                        alt={`${pet.name}`}
                                    />
                                )}
                            </div>
                            <div className="post-details">
                                <p><strong>Breed:</strong> {pet.breed}</p>
                                <p><strong>Age:</strong> {pet.age}</p>
                                <p><strong>Gender:</strong> {pet.gender}</p>
                                <p><strong>Category:</strong> {pet.category}</p>
                                <p><strong>Medical History:</strong> {pet.medical_history}</p>
                                <p><strong>Description:</strong> {pet.description}</p>
                                <p><strong>Location:</strong> {pet.location}</p>
                            </div>
                            <div className='buttons'>
                            <button onClick={() => handleEditClick(pet)} className="edit-btn">Edit</button>
                            <button className="delete-btn" onClick={() => handleDelete(pet._id)}>
                                    Delete
                                </button>
                            </div>
                            
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageAdoptions;
