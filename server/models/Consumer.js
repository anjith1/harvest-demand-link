const mongoose = require('mongoose');
const User = require('./User');

const consumerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  zipCode: {
    type: String,
    required: true
  },
  preferences: [{
    type: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes
consumerSchema.index({ userId: 1 });
consumerSchema.index({ city: 'text' });

module.exports = mongoose.model('Consumer', consumerSchema); 