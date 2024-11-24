const express = require('express');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const petModel = require('../model/pets');
const userModel = require('../model/users');
const router = express.Router();

// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage }).array('media', 5);

// JWT Token verification middleware
function verifyToken(req, res, next) {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    try {
        if (!token) throw 'Unauthorized Access';
        const payload = jwt.verify(token, "secret");
        if (!payload) throw 'Unauthorized Access';
        
        req.userId = payload.userId;
        next();
    } catch (error) {
        res.status(401).json({ message: error });
    }
}




// GET: Fetch all pets
router.get('/', verifyToken, async (req, res) => {
    try {
        const pets = await petModel.find();
        res.status(200).json(pets);
    } catch (error) {
        res.status(500).send("Error fetching pets");
    }
});

// POST: Add a new pet with media files
router.post('/post', verifyToken, upload, async (req, res) => {
    console.log(req.files);
    try {
        const { name, age, breed, gender, medical_history, description, category, location } = req.body;
        const mediaPaths = req.files.map(file => `uploads/${file.filename}`);

        // Use req.userId directly here
        const petData = {
            name, age, breed, gender, medical_history, description, category, location,
            media: mediaPaths,
            owner_id: req.userId // Correctly use the userId from the token
        };

        const newPet = await petModel.create(petData);
        res.status(200).json({ message: "Post successful with media", petData: newPet });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Post unsuccessful", error: error.message });
    }
});

// PUT: Update pet details by ID
router.put('/pets/:_id', async (req, res) => {
    try {
      const petId = req.params._id;
      const updatedData = req.body; // Assuming you're sending the updated data in the body
      const updatedPet = await petModel.findByIdAndUpdate(petId, updatedData, { new: true });

      if (!updatedPet) {
        return res.status(404).json({ message: 'Pet not found' });
      }

      res.status(200).json(updatedPet);
    } catch (error) {
      console.error("Error updating pet:", error);
      res.status(500).json({ message: 'Error updating pet' });
    }
});

// DELETE: Delete pet by ID
router.delete('/remove/:id', verifyToken, async (req, res) => {
    try {
        const id = req.params.id;
        const deletedPet = await petModel.findByIdAndDelete(id); // Correct the model name here

        if (!deletedPet) {
            return res.status(404).json({ message: 'Pet not found' });
        }

        res.status(200).json({ message: 'Pet deleted successfully' });
    } catch (error) {
        console.error("Error deleting pet:", error);
        res.status(500).json({ message: 'Server error while deleting pet' });
    }
});

module.exports = router;


