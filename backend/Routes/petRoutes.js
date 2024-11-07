// petRoutes.js

const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const petModel = require('../model/pets');
const { protect } = require('../middleware/protect.js'); // Assuming you have an auth middleware to protect routes

// Multer storage setup and file handling
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|mp4|mkv|avi/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Error: File upload only supports images and videos');
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: fileFilter,
}).array('media', 10);

router.post('/pet/post', upload, (req, res) => {
    const petData = req.body;
    const files = req.files;

    const mediaPaths = files.map(file => `/uploads/${file.filename}`);

    petData.media = mediaPaths;

    // Save pet data to the database (replace with your actual DB code)
    petModel.create(petData)
        .then((newPet) => {
            res.json({
                message: 'Pet added successfully with media',
                petData: newPet,
            });
        })
        .catch((error) => {
            res.status(500).json({
                message: 'Error adding pet',
                error: error.message,
            });
        });
});

// Get pet details by ID
router.get('/pets/:_id', async (req, res) => {
    try {
      const pet = await petModel.findById(req.params.petId);  // Find pet by ID
      if (!pet) return res.status(404).json({ message: 'Pet not found' });
      res.json({ petData: pet });  // Send the pet data in response
    } catch (error) {
      console.error('Error fetching pet:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });


module.exports = router; 