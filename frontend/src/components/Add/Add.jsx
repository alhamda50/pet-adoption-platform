import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../axiosinterceptor';
import './Add.css';

const Add = () => {
    const [petData, setPetData] = useState({
        category: '',
        name: '',
        age: '',
        breed: '',
        gender: '',
        location: '',
        medical_history: '',
        description: '',
        status: 'available',
        images: []
    });
    const navigate = useNavigate();

    const handleChange = (event) => {
        setPetData({ ...petData, [event.target.name]: event.target.value });
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setPetData((prevData) => ({
            ...prevData,
            images: files
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        Object.keys(petData).forEach((key) => {
            if (key === 'images') {
                petData.images.forEach((file) => formData.append('media', file));
            } else {
                formData.append(key, petData[key]);
            }
        });

        try {
            const response = await axiosInstance.post('/pet/post', formData);
            alert(response.data.message);
            navigate('/PetDetail');
        } catch (error) {
            console.error("Submission error:", error);
            alert("Failed to submit form. Please try again.");
        }
    };

    return (
        <div className="add-adoption">
            <h3>Add New Adoption</h3>
            <form onSubmit={handleSubmit}>
                <select 
                    name="category" 
                    onChange={handleChange} 
                    required
                    value={petData.category}
                    style={{ color: petData.category === "" ? '#888' : 'black' }}
                >
                    <option value="" disabled hidden>Select Pet Category</option>
                    <option value="Dog">Dog</option>
                    <option value="Cat">Cat</option>
                    <option value="Other">Other</option>
                </select>

                <input type="text" name="name" placeholder="Pet Name" onChange={handleChange} required />
                <input type="text" name="age" placeholder="Pet Age" onChange={handleChange} required />
                <input type="text" name="breed" placeholder="Breed" onChange={handleChange} required />
                
                <select 
                    name="gender" 
                    onChange={handleChange} 
                    required 
                    value={petData.gender}
                    style={{ color: petData.gender ? 'black' : '#888' }}
                >
                    <option value="" disabled hidden>Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                </select>

                <input type="text" name="location" placeholder="Pet Location" onChange={handleChange} required />
                <input type="text" name="medical_history" placeholder="Medical History" onChange={handleChange} />
                <textarea name="description" placeholder="Description" onChange={handleChange}></textarea>
                
                <input 
                    type="file" 
                    name="images" 
                    accept="image/*" 
                    multiple 
                    onChange={handleFileChange} 
                />
                
               <Link to='/p/pets/:_id'> <button type="submit">Post</button></Link>
            </form>
        </div>
    );
};

export default Add; 