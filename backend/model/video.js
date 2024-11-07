const mongoose = require('mongoose');

const videoSchema = mongoose.Schema(
    {
        adopter_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
          },
          owner_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
          },
          start_time: {
            type: Date,
            required: true,
          },
          end_time: {
            type: Date,
          },
          status: {
            type: String,
            enum: ['completed', 'missed'],
            default: 'completed',
          }
    }
)

const videoData = mongoose.model('video', videoSchema);
module.exports = videoData;