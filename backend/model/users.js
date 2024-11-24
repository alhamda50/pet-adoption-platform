const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userEmail: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    username: { type: String, required: true },
    phone: { type: String, required: true },
    role: { 
        type: String, 
        enum: ['user', 'admin'], // Add 'user' and any other valid roles
        default: 'user' 
    },
    created_at: { type: Date, default: Date.now }
});

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;
