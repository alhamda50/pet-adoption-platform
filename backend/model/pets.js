const mongoose = require('mongoose');

const petSchema = new mongoose.Schema({
    name: String,
    age: String,
    breed: String,
    gender: String,
    medical_history: String,
    description: String,
    category: String,
    location: String,  // Add location fields if needed
    media: [String],   // Array of media file paths
    owner_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Assuming 'User' is the name of the user model
    },
});

const petData = mongoose.model('pet', petSchema);

module.exports = petData;
