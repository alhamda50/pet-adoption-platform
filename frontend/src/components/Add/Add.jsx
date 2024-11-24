import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
        media: []
    });
    const navigate = useNavigate();

    const handleChange = (event) => {
        setPetData({ ...petData, [event.target.name]: event.target.value });
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files);
        setPetData((prevData) => ({
            ...prevData,
            media: files
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
    
        const formData = new FormData();
        Object.keys(petData).forEach((key) => {
            if (key === 'media') {
                petData.media.forEach((file) => {
                    formData.append('media', file); // Appending each file correctly
                });
            } else {
                formData.append(key, petData[key]); // Appending other pet details
            }
        });
    
        console.log('Form Data:', Array.from(formData.entries())); // Log FormData for debugging
    
        try {
            const response = await axiosInstance.post('/pet/post', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${localStorage.getItem('token')}` // Add token for authentication
                },
            });
            console.log('Response:', response); // Log the response from backend
            alert(response.data.message);
    
            // Redirect based on category or default
            if (response.data.petData && response.data.petData._id) {
                const category = petData.category;
                switch (category) {
                    case 'Dog':
                        navigate('/dog');
                        break;
                    case 'Cat':
                        navigate('/cat');
                        break;
                    case 'Other':
                        navigate('/others');
                        break;
                    default:
                        navigate(`/p/pet/${response.data.petData._id}`);
                        break;
                }
            } else {
                alert('Failed to retrieve pet data after submission.');
            }
        } catch (error) {
            console.error("Submission error:", error.response ? error.response.data : error.message);
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
                    <option value="dog">Dog</option>
                    <option value="cat">Cat</option>
                    <option value="others">Other</option>
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
                    name="media" 
                    accept="image/*" 
                    multiple 
                    onChange={handleFileChange}  style={{marginBottom: 12}}
                />
                
                 <button type="submit">Post</button>
            </form>
        </div>
    );
};

export default Add;
