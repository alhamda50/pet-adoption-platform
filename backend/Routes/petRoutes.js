const express = require('express');
const petModel = require('../model/pets');
const router = express.Router();

// Get pet details by ID
router.get('/pet/:_id', async (req, res) => {
    try {
        const pet = await petModel.findById(req.params._id);
        if (!pet) return res.status(404).json({ message: 'Pet not found' });
        res.json({ petData: pet });
    } catch (error) {
        console.error('Error fetching pet:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Get pets by category
router.get('/pet/category/:category', async (req, res) => {
    try {
        const pets = await petModel.find({ category: req.params.category });
        res.json({ petData: pets });
    } catch (error) {
        console.error("Error fetching pets:", error);
        res.status(500).json({ message: "Error fetching pets" });
    }
});

module.exports = router;


