import React from 'react';
import { Link } from 'react-router-dom';
import { usePetContext } from '../../Context/PetContext';  // Import the context
import './Item.css'; 

const Item = ({ id, name, image, breed, gender, phone }) => {
    const { setSelectedPet } = usePetContext();  // Use context to set selected pet

    const handlePetClick = () => {
        setSelectedPet({ id, name, image, breed, gender, phone });
    };

    return (
        <div className="item">
            <Link to={`/pet/${id}`} onClick={handlePetClick}> {/* Add click handler */}
                <img src={image[0]} alt={name} /> 
            </Link>
            <p>{name}</p>
            <div className="item-data">
                <p>Breed: {breed}</p>
                <p>Gender: {gender}</p>
                {phone && <p>Contact: {phone}</p>}
            </div>
        </div>
    );
};

export default Item;
