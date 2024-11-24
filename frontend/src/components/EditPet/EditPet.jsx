import React, { useState } from 'react';
import axiosInstance from '../../axiosinterceptor';
import { useLocation, useNavigate } from 'react-router-dom';
import './EditPet.css';

const EditPet = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { pet } = location.state || {};
    const [petData, setPetData] = useState(pet || {});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setPetData({ ...petData, [name]: value });
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.put(`http://localhost:3000/pet/pets/${petData._id}`, petData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            alert('Pet updated');
            navigate('/manage');
        } catch (error) {
            console.log(error);
            alert('Failed to update pet');
        }
    };

    return (
        <div className="edit-form">
            <h3>Edit Pet</h3>
            <form onSubmit={handleUpdate}>
                {Object.entries(petData).map(([key, value]) => (
                    (key !== '_id' && key !== '__v' && key !== 'owner_id' && key !== 'media') && (
                        <div key={key}>
                            <label>{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                            <input
                                type="text"
                                name={key}
                                value={value}
                                onChange={handleInputChange}
                            />
                        </div>
                    )
                ))}
                <button type="submit" className="update-btn">Update Pet</button>
            </form>
        </div>
    );
};

export default EditPet;
