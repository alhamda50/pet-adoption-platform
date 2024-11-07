const mongoose = require('mongoose');

const messageSchema = mongoose.Schema(
    {
        sender_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
          },
          receiver_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
          },
          content: {
            type: String,
            required: true,
          },
          timestamp: {
            type: Date,
            default: Date.now,
          }
    }
)

const messageData = mongoose.model('message', messageSchema);
module.exports = messageData;