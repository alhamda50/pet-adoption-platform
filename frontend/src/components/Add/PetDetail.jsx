import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../../axiosinterceptor';

const PetDetail = () => {
  const { _id } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPetDetails = async () => {
      try {
        const response = await axiosInstance.get(`p/pet/${_id}`);
        setPet(response.data.petData);
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch pet details');
        setLoading(false);
      }
    };
    fetchPetDetails();
  }, [_id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {pet && (
        <div>
          <h2>{pet.name}</h2>
          {pet.media && pet.media.length > 0 ? (
            pet.media.map((media, index) => (
              <img
                key={index}
                src={`http://localhost:3000/${media}`}
                alt={`Pet Media ${index + 1}`}
                style={{ width: "50px", height: "auto" }}
              />
            ))
          ) : (
            <p>No media available</p>
          )}
          <p><strong>Age:</strong> {pet.age}</p>
          <p><strong>Breed:</strong> {pet.breed}</p>
          <p><strong>Location:</strong> {pet.location}</p>
          <p><strong>Medical History:</strong> {pet.medical_history}</p>
        </div>
      )}
    </div>
  );
};

export default PetDetail;
