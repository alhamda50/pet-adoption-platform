import React, { createContext, useContext, useEffect, useState } from 'react';
import axiosInstance from '../axiosinterceptor';

const PetContext = createContext();

export const PetProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setIsLoggedIn(true);
            // Fetch user profile using token and update `user` context
            axiosInstance.get('/user/profile', {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then(response => setUser(response.data.user))
            .catch(error => console.error('Error fetching user profile:', error));
        }
    }, []);

    return (
        <PetContext.Provider value={{ user, setUser, isLoggedIn, setIsLoggedIn }}>
            {children}
        </PetContext.Provider>
    );
};

export const usePetContext = () => useContext(PetContext);
