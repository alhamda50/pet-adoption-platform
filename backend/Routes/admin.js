const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
router.use(express.json());
const userModel = require('../model/users');

const adminAuth = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Access denied: Admins only' });
    }
};

// Admin login route
router.post('/login', async (req, res) => {
    const { userEmail, password } = req.body;

    try {
        const admin = await userModel.findOne({ userEmail, role: 'admin' }); // Ensure role is 'admin'
        if (!admin) {
            return res.status(404).json({ message: "Admin not found" });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (isMatch) {
            const payload = { userEmail: admin.userEmail, userId: admin._id, role: admin.role }; // Include role
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
            return res.status(200).json({ message: "Admin login successful", adminToken: token });
        } else {
            return res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Simple GET method to check if the route is working
router.get('/check', async (req, res) => {
    const data = await userModel.find();
    res.status(200).json(data);
});

module.exports = router;
