const mongoose = require('mongoose');

const shopStockSchema = new mongoose.Schema({
  shopKeeperId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ShopKeeper',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['खाद', 'बीज', 'कीटनाशक', 'उर्वरक', 'उपकरण', 'अन्य']
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  discount: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'लीटर', 'बोरी', 'पैक', 'थैली', 'बॉक्स', 'अन्य']
  },
  description: String,
  rating: {
    type: Number,
    default: 4.5,
    min: 0,
    max: 5
  },
  expiryDate: Date,
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

const ShopStock = mongoose.model('ShopStock', shopStockSchema);

module.exports = ShopStock;
