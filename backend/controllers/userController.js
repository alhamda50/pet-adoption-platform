// controllers/userController.js
const User = require('../models/userModel'); // Import user model
const jwt = require('jsonwebtoken');

// Function to handle user login
const userLogin = async (req, res) => {
    const { userEmail, password } = req.body;

    try {
        // Find the user based on the provided email
        const user = await User.findOne({ userEmail });

        // Check if user exists and the password matches
        if (user && user.password === password) {
            // Create JWT token based on user ID and role
            const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
                expiresIn: '1h',
            });

            return res.status(200).json({
                usertoken: token,
                user: { email: user.userEmail, username: user.username },
                role: user.role,
            });
        }

        // If user doesn't exist or password doesn't match
        res.status(400).json({ error: 'Invalid credentials' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error during login' });
    }
};

// Function to handle user registration
const userRegister = async (req, res) => {
    const { username, userEmail, password, phone } = req.body;

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ userEmail });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Create new user with default role of 'adopter'
        const newUser = new User({ username, userEmail, password, phone, role: 'adopter' });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error registering user' });
    }
};

module.exports = {
    userLogin,
    userRegister,
};
