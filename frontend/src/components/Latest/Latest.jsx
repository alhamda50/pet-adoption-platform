import React, { useEffect, useState } from 'react';
import './Latest.css';
import Item from '../Items/Item';
import axios from 'axios';

const Latest = () => {
  const [petData, setPetData] = useState([]);

  useEffect(() => {
    const fetchPets = async () => {
      try {
        // Get the token from localStorage
        const token = localStorage.getItem('token');

        // If token exists, make an authenticated request
        const response = await axios.get('http://localhost:3000/pet', {
          headers: {
            Authorization: `Bearer ${token}` // Attach token as a Bearer token
          }
        });

        setPetData(response.data.pets || []); // Adjust if data structure changed
      } catch (error) {
        console.error('Error fetching pet data:', error);
        // Optional: Handle unauthorized access
        if (error.response && error.response.status === 401) {
          alert('Unauthorized access. Please log in again.');
          // Redirect to login or clear token, as needed
          localStorage.removeItem('token');
        }
      }
    };

    fetchPets();
  }, []);

  return (
    <div className='latest'>
      <div className='latest-text'>
        <h1>NEWLY ADDED</h1>
        <hr />
      </div>

      <div className="latest-item">
        {Array.isArray(petData) ? (
          petData.map((item, i) => (
            <Item key={i} id={item.id} name={item.name} image={item.images} breed={item.breed} gender={item.gender} />
          ))
        ) : (
          <p>No pets available at this time.</p>
        )}
      </div>
    </div>
  );
};

export default Latest;
