import React, { useState, useEffect } from "react";
import axiosInstance from "../../axiosinterceptor";
import { useNavigate } from "react-router-dom";
import '../ManageAdoptions/ManageAdoptions.css'; // Use the same CSS as ManageAdoptions

const ManagePet = () => {
    const [pets, setPets] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch all pets
        axiosInstance.get('/pet/')
            .then(response => {
                console.log("Pets fetched:", response.data);
                if (response.data && Array.isArray(response.data)) {
                    setPets(response.data);
                } else {
                    setErrorMessage("Error fetching pets data.");
                }
            })
            .catch(err => {
                console.error("Error fetching pets:", err);
                setErrorMessage("Error fetching pets data.");
            });
    }, []);

    const handleDeletePet = (petId) => {
        axiosInstance.delete(`/pet/remove/${petId}`)
            .then(() => {
                setPets(pets.filter(pet => pet._id !== petId)); // Remove pet from UI
                alert('Pet deleted');
            })
            .catch(err => console.error("Error deleting pet:", err));
    };

    const handleEditClick = (pet) => {
        // Ensure the pet object has required fields before navigating
        if (pet && pet._id) {
            navigate(`edit-pet/${pet._id}`, { state: { pet } });
        } else {
            alert("Pet data is incomplete or invalid. Cannot proceed to edit.");
        }
    };

    return (
        <div className="manage-adoptions">
            <h2>Manage Your Pets</h2>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            {pets.length === 0 ? (
                <p>You haven't posted any pets for adoption yet.</p>
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
                            <div className="buttons">
                                <button onClick={() => handleEditClick(pet)} className="edit-btn">Edit</button>
                                <button className="delete-btn" onClick={() => handleDeletePet(pet._id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManagePet;
