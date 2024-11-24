import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosinterceptor';
import { Link } from 'react-router-dom'; // Import Link component
import './CSS/PetCategory.css'

const PetCategory = ({ category }) => {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null); // Error state

    // Fetch pets based on category
    const fetchPets = async () => {
        try {
            if (!category) {
                throw new Error("Category is undefined.");
            }
            console.log("Fetching pets for category:", category);
            const response = await axiosInstance.get(`p/pet/category/${category}`);
            if (response.data && response.data.petData) {
                console.log('Fetched Pets:', response.data.petData);
                setPets(response.data.petData);
            } else {
                console.log('No pets available in this category.');
                setPets([]);  // Handle empty data
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching pets:", error);
            setError(error.message);  // Set error message to state
            setLoading(false);  // Stop loading
        }
    };

    useEffect(() => {
        console.log("Selected category:", category); // Check the category
        if (category) {
            fetchPets();
        }
    }, [category]); // Fetch pets when the category changes

    if (loading) {
        return <p>Loading pets...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;  // Show the error if something went wrong
    }

    return (
        <div>
            <h2 style={{textAlign: 'center', margin: 50}}>
                {category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Category'} for Adoption
            </h2>

            {pets.length === 0 ? (
                <p>No pets available for adoption in this category.</p>
            ) : (
                <div className="pet-list">
                    {pets.map((pet) => (
                        <Link key={pet._id} to={`/pet/${pet._id}`} className="pet-card-link"> {/* Wrap pet card in Link */}
                            <div className="pet-card">
                                {/* Check if pet.images is an array and has at least one image */}
                                <img 
                                    src={pet.media && pet.media.length > 0 ? `http://localhost:3000/${pet.media[0]}` : '/path/to/default-media.jpg'} 
                                    alt={pet.name} 
                                />
                                <h4>{pet.name}</h4>
                                <p>{pet.gender}</p>
                                <p>Age: {pet.age}</p>
                                <p>Breed: {pet.breed}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PetCategory;
