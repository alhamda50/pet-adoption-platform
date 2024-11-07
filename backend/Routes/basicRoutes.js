const express = require('express');
const multer = require('multer');
const path = require('path');
const jwt = require('jsonwebtoken');
const petModel = require('../model/pets');
const { protect } = require('../middleware/protect');
const router = express.Router();

// Middleware for parsing JSON and form data
router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// Multer setup for image and video uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Set storage location
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        // Generate a unique filename using the original name and timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage }).array('media', 5); // You can upload up to 5 files at once

// JWT Token verification middleware
function verifyToken(req, res, next) {
    let token = req.headers.authorization && req.headers.authorization.split(' ')[1];
    try {
        if (!token) throw 'Unauthorized Access';
        let payload = jwt.verify(token, "secret");
        if (!payload) throw 'Unauthorized Access';
        
        req.userId = payload.userId;  // Attach user ID to request
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

// POST: Add a new pet adoption with images/videos
// POST: Add a new pet adoption with images/videos
router.post('/post', verifyToken, upload, async (req, res) => {
    try {
        const { name, age, breed, gender, medical_history, description, category, location } = req.body;
        const mediaPaths = req.files ? req.files.map(file => `uploads/${file.filename}`) : [];
        
        const petData = { name, age, breed, gender, medical_history, description, category, location, media: mediaPaths, owner_id: req.userId };
        const newPet = new petModel(petData);
        await newPet.save();
    
res.status(200).json({ message: "Post successful with media", petData: newPet });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Post unsuccessful", error: error.message });
    }
});


module.exports = router;