import React, { useState, useEffect } from 'react';
import axiosInstance from '../axiosinterceptor'; // Assuming your axios instance is set up to handle API calls

const PetCategory = ({ category }) => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch pets based on category
  const fetchPets = async () => {
    try {
      const response = await axiosInstance.get(`/pet/category/${category}`);
      console.log('Fetched pets:', response.data.petData); // Debugging the response data
      setPets(response.data.petData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching pets:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, [category]); // Fetch pets whenever the category changes

  if (loading) {
    return <p>Loading pets...</p>;
  }

  return (
    <div>
      <h3>{category} for Adoption</h3>
      {pets.length === 0 ? (
        <p>No pets available for adoption in this category.</p>
      ) : (
        <div className="pet-list">
          {pets.map((pet) => (
            <div key={pet._id} className="pet-card">
              <img src={pet.media[0]} alt={pet.name} /> {/* Changed images to media */}
              <h4>{pet.name}</h4>
              <p>{pet.description}</p>
              <p>Age: {pet.age}</p>
              <p>Breed: {pet.breed}</p>
              {/* Add any additional pet details you want to display */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PetCategory;
