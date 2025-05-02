const mongoose = require('mongoose');

const necessitySchema = new mongoose.Schema({
  item: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  unit: {
    type: String,
    required: true
  }
});

const locationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  position: {
    type: [Number], // [latitude, longitude]
    required: true,
    index: '2dsphere' // Enable geospatial queries
  },
  name: {
    type: String,
    required: true
  },
  necessities: [necessitySchema],
  status: {
    type: String,
    enum: ['pending', 'fulfilled', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for geospatial queries
locationSchema.index({ position: '2dsphere' });

module.exports = mongoose.model('Location', locationSchema);
