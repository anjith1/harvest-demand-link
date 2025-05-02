const express = require('express');
const router = express.Router();
const NecessityRequest = require('../models/NecessityRequest');
const auth = require('../middleware/auth');

// Create a new necessity request
router.post('/', auth, async (req, res) => {
  try {
    const {
      items,
      urgency,
      timeNeeded,
      location
    } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'At least one item is required' });
    }

    if (!urgency || !['low', 'medium', 'high'].includes(urgency.toLowerCase())) {
      return res.status(400).json({ message: 'Valid urgency level is required' });
    }

    if (!timeNeeded) {
      return res.status(400).json({ message: 'Time needed is required' });
    }

    if (!location || !location.coordinates || !Array.isArray(location.coordinates)) {
      return res.status(400).json({ message: 'Valid location coordinates are required' });
    }

    // Create new request
    const necessityRequest = new NecessityRequest({
      consumerId: req.user._id,
      consumerName: req.user.name,
      items,
      urgency: urgency.toLowerCase(),
      timeNeeded,
      location,
      status: 'pending'
    });

    // Save request
    await necessityRequest.save();

    res.status(201).json(necessityRequest);
  } catch (error) {
    console.error('Create request error:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all requests
router.get('/', auth, async (req, res) => {
  try {
    const requests = await NecessityRequest.find()
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's requests
router.get('/my-requests', auth, async (req, res) => {
  try {
    const requests = await NecessityRequest.find({ consumerId: req.user._id })
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error('Get user requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Accept a request
router.patch('/:id/accept', auth, async (req, res) => {
  try {
    const { deliveryTime } = req.body;
    if (!deliveryTime) {
      return res.status(400).json({ message: 'Delivery time is required' });
    }

    const request = await NecessityRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request is no longer pending' });
    }

    request.status = 'accepted';
    request.acceptedBy = req.user._id;
    request.deliveryTime = deliveryTime;
    await request.save();

    res.json(request);
  } catch (error) {
    console.error('Accept request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reject a request
router.patch('/:id/reject', auth, async (req, res) => {
  try {
    const request = await NecessityRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ message: 'Request is no longer pending' });
    }

    request.status = 'rejected';
    await request.save();

    res.json(request);
  } catch (error) {
    console.error('Reject request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 