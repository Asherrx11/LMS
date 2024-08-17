const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    content: { type: String, required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Assuming you have a User model
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' }, // Link to Course if applicable
    timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
