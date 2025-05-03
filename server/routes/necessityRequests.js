const express = require('express');
const router = express.Router();
const NecessityRequest = require('../models/NecessityRequest');
const auth = require('../middleware/auth');
const User = require('../models/User');

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

    // Get user data to include consumer name
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create new request
    const necessityRequest = new NecessityRequest({
      consumerId: req.user.userId,
      consumerName: user.name,
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

// Get all requests (for farmers)
router.get('/', auth, async (req, res) => {
  try {
    // Get farmer's location from query params
    const { lat, lng } = req.query;
    let query = {};

    // If farmer's location is provided, sort by distance
    if (lat && lng) {
      const farmerLocation = [parseFloat(lat), parseFloat(lng)];
      
      // Get all requests
      const requests = await NecessityRequest.find()
        .sort({ createdAt: -1 });

      // Calculate distances and add to response
      const requestsWithDistance = requests.map(request => {
        const distance = calculateDistance(
          farmerLocation[0],
          farmerLocation[1],
          request.location.coordinates[0],
          request.location.coordinates[1]
        );
        return {
          ...request.toObject(),
          distance
        };
      });

      // Sort by distance
      requestsWithDistance.sort((a, b) => a.distance - b.distance);
      return res.json(requestsWithDistance);
    }

    // If no location provided, just return all requests sorted by creation date
    const requests = await NecessityRequest.find()
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error('Get requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's requests (for consumers)
router.get('/my-requests', auth, async (req, res) => {
  try {
    const requests = await NecessityRequest.find({ consumerId: req.user.userId })
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error('Get user requests error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get farmer's accepted requests
router.get('/my-accepted', auth, async (req, res) => {
  try {
    const requests = await NecessityRequest.find({ 
      acceptedBy: req.user.userId,
      status: { $in: ['accepted', 'fulfilled'] }
    }).sort({ createdAt: -1 });
    res.json(requests);
  } catch (error) {
    console.error('Get accepted requests error:', error);
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
    request.acceptedBy = req.user.userId;
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

// Mark request as fulfilled
router.patch('/:id/fulfill', auth, async (req, res) => {
  try {
    const request = await NecessityRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    if (request.status !== 'accepted' || request.acceptedBy.toString() !== req.user.userId.toString()) {
      return res.status(400).json({ message: 'Cannot fulfill this request' });
    }

    request.status = 'fulfilled';
    await request.save();

    res.json(request);
  } catch (error) {
    console.error('Fulfill request error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Helper function to calculate distance between two points
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

module.exports = router; 