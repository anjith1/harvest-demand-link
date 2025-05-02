const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Location = require('../models/Location');

// Create a new location
router.post('/', auth, async (req, res) => {
  try {
    const { position, name, necessities } = req.body;
    const location = new Location({
      user: req.user.userId,
      position,
      name,
      necessities
    });
    await location.save();
    res.status(201).json(location);
  } catch (error) {
    res.status(500).json({ message: 'Error creating location', error: error.message });
  }
});

// Get all locations
router.get('/', auth, async (req, res) => {
  try {
    const locations = await Location.find()
      .populate('user', 'name email role')
      .sort({ createdAt: -1 });
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching locations', error: error.message });
  }
});

// Get locations within radius (in kilometers)
router.get('/nearby', auth, async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query;
    
    const locations = await Location.find({
      position: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: radius * 1000 // Convert km to meters
        }
      }
    }).populate('user', 'name email role');
    
    res.json(locations);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching nearby locations', error: error.message });
  }
});

// Update location status
router.patch('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const location = await Location.findById(id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    // Only allow user who created the location or admin to update
    if (location.user.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this location' });
    }

    location.status = status;
    await location.save();
    
    res.json(location);
  } catch (error) {
    res.status(500).json({ message: 'Error updating location', error: error.message });
  }
});

// Delete location
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const location = await Location.findById(id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    // Only allow user who created the location or admin to delete
    if (location.user.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this location' });
    }

    await location.deleteOne();
    res.json({ message: 'Location deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting location', error: error.message });
  }
});

module.exports = router;
