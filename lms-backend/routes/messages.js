// routes/messages.js
const express = require('express');
const Message = require('../models/message');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();

// GET all messages for a specific course
router.get('/:courseId', authenticateToken, async (req, res) => {
    try {
        const messages = await Message.find({ course: req.params.courseId }).populate('sender').sort('timestamp');
        res.json(messages);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST a new message
router.post('/:courseId', authenticateToken, async (req, res) => {
    const { content } = req.body;
    const newMessage = new Message({
        content,
        sender: req.user._id,  // Assuming req.user is set in your auth middleware
        course: req.params.courseId
    });

    try {
        const savedMessage = await newMessage.save();
        res.status(201).json(savedMessage);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

module.exports = router;
