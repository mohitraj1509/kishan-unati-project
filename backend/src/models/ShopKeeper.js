const mongoose = require('mongoose');

const shopKeeperSchema = new mongoose.Schema({
  shopName: {
    type: String,
    required: true,
    trim: true
  },
  ownerName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    unique: true,
    match: /^[0-9]{10}$/
  },
  email: {
    type: String,
    sparse: true,
    lowercase: true
  },
  location: {
    type: String,
    required: true
  },
  state: String,
  district: String,
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  latitude: Number,
  longitude: Number,
  timings: {
    open: { type: String, default: '6 AM' },
    close: { type: String, default: '8 PM' }
  },
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5
  },
  reviews: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hide password by default
shopKeeperSchema.methods.toJSON = function() {
  const { password, ...rest } = this.toObject();
  return rest;
};

const ShopKeeper = mongoose.model('ShopKeeper', shopKeeperSchema);

module.exports = ShopKeeper;
