import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../axiosinterceptor'; // Assuming you've set up axios instance

const PetDetail = () => {
  const { _id } = useParams();  // Accessing the petId from the URL
  const [pet, setPet] = useState(null);

  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        const response = await axiosInstance.get(`p/pet/${_id}`);
        console.log('Pet details fetched:', response.data.petData);  // Debugging the response data
        setPet(response.data.petData);  // Assuming the API returns the pet details
      } catch (error) {
        console.error('Error fetching pet details:', error);
      }
    };
    fetchPetDetails();
  }, [_id]);  // Fetch pet details when petId changes

  return (
    <div>
      {pet ? (
        <div>
          <h2>{pet.name}</h2>
          <img src={pet.media[0]} alt={pet.name} /> {/* Changed images to media */}
          <p>{pet.description}</p>
          <p><strong>Age:</strong> {pet.age}</p>
          <p><strong>Breed:</strong> {pet.breed}</p>
          <p><strong>Location:</strong> {pet.location}</p>
          <p><strong>Medical History:</strong> {pet.medical_history}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default PetDetail;
