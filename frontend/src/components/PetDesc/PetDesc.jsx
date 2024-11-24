import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axiosInstance from '../../axiosinterceptor';
import { usePetContext } from '../../context/PetContext';
import './PetDesc.css';

const PetDesc = () => {
    const { id } = useParams();
    const [pet, setPet] = useState(null);
    const [ownerPhone, setOwnerPhone] = useState(null);
    const [loading, setLoading] = useState(true);

    const { user } = usePetContext();  // Get user from context
    const navigate = useNavigate();
    const location = useLocation();

    console.log("Current User in PetDesc:", user);  // Debugging line

    // Fetch pet details
    const fetchPetDetails = async () => {
        setLoading(true);  // Show loading while fetching
        try {
            const response = await axiosInstance.get(`p/pet/${id}`);
            setPet(response.data.petData);

            if (response.data.petData.owner_id) {
                const ownerResponse = await axiosInstance.get(`user/users/${response.data.petData.owner_id}`);
                setOwnerPhone(ownerResponse.data.phone);
            }
            setLoading(false);  // Hide loading once done
        } catch (error) {
            console.error('Error fetching pet details:', error);
            setLoading(false);
        }
    };

    // Trigger fetch when the id or user changes
    useEffect(() => {
        if (id) {
            fetchPetDetails();
        }
    }, [id]);

    useEffect(() => {
        if (user) {
            console.log("User logged in, fetching pet details...");
            fetchPetDetails();
        }
    }, [user, id]);  // Trigger refetch when user logs in or id changes

    const handleContactOwnerClick = () => {
        navigate('/login', { state: { from: location.pathname } });
    };

    if (loading) return <p className="loading">Loading pet details...</p>;
    if (!pet) return <p className="no-pet">No pet found.</p>;

    return (
        <div className="pet-desc-container">
            <div className="pet-images">
                {pet.media && pet.media.length > 0 ? (
                    pet.media.map((media, index) => (
                        <img
                            key={index}
                            src={`http://localhost:3000/${media}`}
                            alt={`Pet Media ${index + 1}`}
                            className="pet-media"
                        />
                    ))
                ) : (
                    <p>No media available</p>
                )}
            </div>

            <div className="pet-details">
                <h2 className="pet-name">{pet.name}</h2>
                <p className="pet-age">Age: {pet.age}</p>
                <p className="pet-breed">Breed: {pet.breed}</p>
                <p className="pet-gender">Gender: {pet.gender}</p>
                <p className="pet-location">Location: {pet.location}</p>
                <p className="pet-category">Category: {pet.category}</p>
                <p className="pet-medical-history">Medical History: {pet.medical_history}</p>

                <div className="pet-description">
                    <h3>Description</h3>
                    <p>{pet.description}</p>
                </div>

                <div className="contact-owner">
                    {user && ownerPhone ? (
                        <p>Contact the owner: <span>{ownerPhone}</span></p>
                    ) : (
                        <p style={{ color: '#2b7a78' }}>LOGIN TO VIEW CONTACT DETAILS</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PetDesc;
