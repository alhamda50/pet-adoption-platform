import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Item from '../Items/Item'; // Import the Item component

const Latest = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch the latest 4 pets from the backend API
    const fetchLatestPets = async () => {
      try {
        const response = await axios.get('pet/'); // Your API endpoint to fetch latest 4 pets
        console.log(response.data); // Log the response data for debugging
        setPets(response.data); // Set pets if it's an array
        setLoading(false);
      } catch (error) {
        console.error('Error fetching pets:', error);
        setLoading(false);
      }
    };

    fetchLatestPets();
  }, []);

  if (loading) {
    return <p>Loading pets...</p>;
  }

  if (!Array.isArray(pets) || pets.length === 0) {
    return <p>No pets available at this time.</p>;
  }

  return (
    <div className="latest-pets">
      <h2>Latest Pets</h2>
      <div className="pets-list">
        {pets.map(pet => (
          <Item
            key={pet._id}
            id={pet._id}
            name={pet.name}
            image={pet.media}
            breed={pet.breed}
            gender={pet.gender}
            phone={pet.owner_id ? pet.owner_id.phone : null}
          />
        ))}
      </div>
    </div>
  );
};

export default Latest;
