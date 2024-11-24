const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
require('../db/connection');
const userModel = require('../model/users'); // User model
const postModel = require('../model/posts'); // Post model
const petModel = require('../model/pets'); // Pet model

router.use(express.json());

// JWT Authentication Middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        console.log("Token not provided");
        return res.status(401).json({ message: 'Token not provided' });
    }

    jwt.verify(token, "secret", (err, user) => {
        if (err) {
            console.log("Invalid token", err);
            return res.status(403).json({ message: 'Invalid token' });
        }
        console.log("Token valid. User:", user);
        req.userEmail = user.userEmail; // Store the user email
        req.userId = user.userId; // Store the user id from the token
        req.userRole = user.role; // Add role to the request
        next();
    });
};




router.get('/', async (req,res) => {
    try {
        const user = await userModel.find();
        res.status(200).send(user)
    } catch (error) {
        res.status(400).send('not found')
    }
})




// Update user details (by user ID)
router.put('/put/:id', async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user fields based on the request body
        const updatedUser = await userModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ message: 'User updated successfully', updatedUser });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Unable to update user' });
    }
});

// Delete user (by user ID)
router.delete('/delete/:id', authenticateToken, async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // If the logged-in user is an admin, allow deleting any user
        if (req.userRole !== 'admin' && user._id.toString() !== req.userId) {
            return res.status(403).json({ message: 'You are not authorized to delete this user' });
        }

        // Delete the user
        await userModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Unable to delete user' });
    }
});



// User registration route
router.post('/register', async (req, res) => {
    console.log('Incoming registration request:', req.body); // Log incoming data
    const { userEmail, password, username, phone, role = 'user' } = req.body;

    // Manual validation
    if (!userEmail || !password || !username || !phone) {
        return res.status(400).json({ message: 'All fields are required' });
    }

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
            role,
            created_at: new Date()
        });

        await newUser.save();
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
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

        if (!isMatch) {
            // If password does not match, send an error response
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // If email and password are correct, generate JWT
        const payload = { userEmail: user.userEmail, userId: user._id, role: user.role };
        const token = jwt.sign(payload, "secret", { expiresIn: '1h' });

        // Return the appropriate response based on user role
        if (user.role === 'admin') {
            return res.status(200).json({ message: "Admin login successful", usertoken: token, role: user.role, dashboard: 'admin' });
        } else {
            return res.status(200).json({ message: "Login successful", usertoken: token, role: user.role });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


// Profile route (requires authentication)
router.get('/profile', authenticateToken, async (req, res) => {
    try {
        const user = await userModel.findOne({ userEmail: req.userEmail });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        const postsCount = await postModel.countDocuments({ userId: user._id });  // Fetch post count by userId
        const petsCount = await petModel.countDocuments({ owner_id: user._id });  // Fetch pet count by owner_id

        res.status(200).json({ user, postsCount, petsCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Fetch posts for logged-in user
router.get('/posts', authenticateToken, async (req, res) => {
    console.log('Request received with userId:', req.userId);
    try {
        const posts = await postModel.find({ userId: req.userId });
        res.status(200).json({ posts });
    } catch (error) {
        console.error('Error fetching posts:', error);
        res.status(500).json({ message: 'Unable to fetch posts' });
    }
});

// Fetch pets for logged-in user
router.get('/pets', authenticateToken, async (req, res) => {
    console.log('Request received with userId:', req.userId);
    try {
        const pets = await petModel.find({ owner_id: req.userId });
        res.status(200).json({ pets });
    } catch (error) {
        console.error('Error fetching pets:', error);
        res.status(500).json({ message: 'Unable to fetch pets' });
    }
});

// Fetch adoption posts for logged-in user
router.get('/user/posts', authenticateToken, async (req, res) => {
    try {
        const posts = await postModel.find({ owner_id: req.userId });
        res.status(200).json({ posts });
    } catch (error) {
        console.error('Error fetching adoption posts:', error);
        res.status(500).json({ message: 'Unable to fetch adoption posts' });
    }
});

// Edit adoption post (by owner)
router.put('/posts/:postId', authenticateToken, async (req, res) => {
    try {
        const post = await postModel.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.owner_id.toString() !== req.userId) {
            return res.status(403).json({ message: 'You are not authorized to edit this post' });
        }

        const updatedPost = await postModel.findByIdAndUpdate(req.params.postId, req.body, { new: true });
        res.status(200).json({ message: 'Post updated successfully', updatedPost });
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ message: 'Unable to update post' });
    }
});

// Delete adoption post (by owner)
router.delete('/posts/:postId', authenticateToken, async (req, res) => {
    try {
        const post = await postModel.findById(req.params.postId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (post.owner_id.toString() !== req.userId) {
            return res.status(403).json({ message: 'You are not authorized to delete this post' });
        }

        await postModel.findByIdAndDelete(req.params.postId);
        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ message: 'Unable to delete post' });
    }
});

// Get user data by ID
router.get('/users/:id', async (req, res) => {
    try {
        const user = await userModel.findById(req.params.id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    } catch (error) {
        res.status(500).send('Error fetching user');
    }
});

module.exports = router;
