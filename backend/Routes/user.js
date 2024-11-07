const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
require('../db/connection');
const userModel = require('../model/users'); // User model
const postModel = require('../model/posts'); // Post model

router.use(express.json());
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Token not provided' });

    jwt.verify(token, "secret", (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.userEmail = user.userEmail; // set userEmail in request from decoded token
        next();
    });
};

// User registration route
router.post('/register', async (req, res) => {
    const { userEmail, password, username, phone } = req.body;

    try {
        const existingUser = await userModel.findOne({ userEmail });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new userModel({
            userEmail,
            password: hashedPassword,
            username,
            phone,
            created_at: new Date()
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// User login route
router.post('/login', async (req, res) => {
    try {
        const user = await userModel.findOne({ userEmail: req.body.userEmail });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (isMatch) {
            const payload = { userEmail: user.userEmail };
            const token = jwt.sign(payload, "secret", { expiresIn: '1h' });
            return res.status(200).json({ message: "Login successful", usertoken: token });
        } else {
            return res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, "secret", (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Failed to authenticate token' });
        }
        req.userEmail = decoded.userEmail;
        next();
    });
};

// Profile route (requires authentication)
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await userModel.findOne({ userEmail: req.userEmail });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const postsCount = await postModel.countDocuments({ userId: user._id });
        res.status(200).json({ user, postsCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Function to get the user's post count
async function getPostsCountForUser(userId) {
    try {
        return await postModel.countDocuments({ userId }); // Counts posts by userId
    } catch (error) {
        console.error(error);
        return 0;
    }
}

module.exports = router;