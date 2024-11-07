import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // For accessing dynamic route params
import axios from 'axios';

const PetDetail = () => {
  const { petId } = useParams(); // Get the pet ID from the URL
  const [pet, setPet] = useState(null);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        // Correct the API endpoint to fetch pet details based on petId
        const response = await axios.get(`/p/pets/${petId}`);  // Updated endpoint
        setPet(response.data.petData);  // Assuming the data is in petData
      } catch (error) {
        console.error('Error fetching pet details:', error);
      }
    };
    fetchPet();
  }, [petId]);

  if (!pet) return <div>Loading...</div>;  // Display loading message while data is fetching

  return (
    <div>
      <h2>{pet.name}</h2>
      <p><strong>Age:</strong> {pet.age}</p>
      <p><strong>Breed:</strong> {pet.breed}</p>
      <p><strong>Gender:</strong> {pet.gender}</p>
      <p><strong>Medical History:</strong> {pet.medical_history}</p>
      <p><strong>Description:</strong> {pet.description}</p>
      <p><strong>Location:</strong> {pet.location}</p>
      <p><strong>Status:</strong> {pet.status}</p>
      <h3>Media:</h3>
      {/* Render media (images/videos) if available */}
      <div>
        {pet.media && pet.media.length > 0 ? (
          pet.media.map((mediaUrl, index) => (
            <div key={index}>
              {mediaUrl.endsWith('.mp4') || mediaUrl.endsWith('.mkv') || mediaUrl.endsWith('.avi') ? (
                <video width="300" controls>
                  <source src={mediaUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <img src={mediaUrl} alt={`pet-media-${index}`} width="300" />
              )}
            </div>
          ))
        ) : (
          <p>No media available.</p>
        )}
      </div>
      <p><strong>Posted by Owner ID:</strong> {pet.owner_id}</p> {/* Show owner ID */}
    </div>
  );
};

export default PetDetail;
