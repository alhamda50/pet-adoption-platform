const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    
      userEmail: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      username: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      // role: {
      //   type: String,
      //   enum: ['admin', 'adopter', 'owner'],
      //   default: 'adopter',
      // },
      
      created_at: {
        type: Date,
        default: Date.now,
      }
})

const userData = mongoose.model('user', userSchema);
module.exports = userData;