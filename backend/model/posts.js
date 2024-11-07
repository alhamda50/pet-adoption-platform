const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', // Referencing the users collection
        required: true,
    },
    title: String,
    content: String,
    created_at: {
        type: Date,
        default: Date.now,
    }
});

const postData = mongoose.model('post', postSchema);
module.exports = postData;
