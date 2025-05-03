const mongoose = require('mongoose');
const User = require('./User');

const farmerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  farmName: {
    type: String,
    required: true
  },
  farmLocation: {
    type: String,
    required: true
  },
  productsOffered: [{
    type: String
  }],
  rating: {
    type: Number,
    default: 0
  },
  totalRatings: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes
farmerSchema.index({ userId: 1 });
farmerSchema.index({ farmLocation: 'text' });

module.exports = mongoose.model('Farmer', farmerSchema); 