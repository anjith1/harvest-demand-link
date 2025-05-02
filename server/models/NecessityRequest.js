const mongoose = require('mongoose');

const necessityRequestSchema = new mongoose.Schema({
  consumerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  consumerName: {
    type: String,
    required: true
  },
  items: [{
    name: {
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
  }],
  urgency: {
    type: String,
    enum: ['low', 'medium', 'high'],
    required: true
  },
  timeNeeded: {
    type: String,
    required: true
  },
  location: {
    name: {
      type: String,
      required: true
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: function(v) {
          return v.length === 2 && 
                 v[0] >= -90 && v[0] <= 90 && 
                 v[1] >= -180 && v[1] <= 180;
        },
        message: 'Coordinates must be valid latitude and longitude values'
      }
    }
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'fulfilled'],
    default: 'pending'
  },
  acceptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  deliveryTime: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add indexes for better query performance
necessityRequestSchema.index({ consumerId: 1 });
necessityRequestSchema.index({ status: 1 });
necessityRequestSchema.index({ createdAt: -1 });

module.exports = mongoose.model('NecessityRequest', necessityRequestSchema); 