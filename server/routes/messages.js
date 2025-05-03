const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const NecessityRequest = require('../models/NecessityRequest');
const auth = require('../middleware/auth');

// Send a message
router.post('/', auth, async (req, res) => {
  try {
    const { requestId, message, receiverId, senderType } = req.body;

    // Validate required fields
    if (!requestId || !message || !receiverId || !senderType) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Verify the request exists
    const request = await NecessityRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Create new message
    const newMessage = new Message({
      requestId,
      senderId: req.user._id,
      receiverId,
      senderType,
      message
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get messages for a request
router.get('/request/:requestId', auth, async (req, res) => {
  try {
    const messages = await Message.find({ requestId: req.params.requestId })
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Mark messages as read
router.patch('/read/:requestId', auth, async (req, res) => {
  try {
    await Message.updateMany(
      { 
        requestId: req.params.requestId,
        receiverId: req.user._id,
        read: false
      },
      { read: true }
    );
    res.json({ message: 'Messages marked as read' });
  } catch (error) {
    console.error('Mark messages as read error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 