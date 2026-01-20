const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    unique: true,
    required: true
  },
  buyer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: [true, 'Please add quantity'],
    min: [1, 'Quantity must be at least 1']
  },
  unitPrice: {
    type: Number,
    required: true,
    min: [0, 'Unit price cannot be negative']
  },
  totalAmount: {
    type: Number,
    required: true,
    min: [0, 'Total amount cannot be negative']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'],
    default: 'pending'
  },
  payment: {
    method: {
      type: String,
      enum: ['card', 'upi', 'net_banking', 'wallet', 'cod'],
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    transactionId: String,
    paymentId: String,
    paidAt: Date
  },
  shipping: {
    address: {
      type: String,
      required: true
    },
    city: String,
    state: String,
    pincode: String,
    coordinates: {
      type: [Number], // [longitude, latitude]
    }
  },
  tracking: {
    carrier: String,
    trackingNumber: String,
    trackingUrl: String,
    estimatedDelivery: Date,
    actualDelivery: Date
  },
  notes: String,
  cancelledAt: Date,
  cancelReason: String,
  refund: {
    amount: Number,
    reason: String,
    processedAt: Date,
    transactionId: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for efficient queries
orderSchema.index({ buyer: 1, createdAt: -1 });
orderSchema.index({ seller: 1, createdAt: -1 });
orderSchema.index({ status: 1 });
orderSchema.index({ orderNumber: 1 });

// Virtual for order age in days
orderSchema.virtual('orderAge').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Pre-save middleware to generate order number
orderSchema.pre('save', function(next) {
  if (this.isNew && !this.orderNumber) {
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.orderNumber = `ORD-${timestamp}-${random}`;
  }
  next();
});

// Static method to get order statistics
orderSchema.statics.getOrderStats = async function(userId, userType = 'buyer') {
  const matchField = userType === 'buyer' ? 'buyer' : 'seller';

  return this.aggregate([
    { $match: { [matchField]: mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$totalAmount' }
      }
    }
  ]);
};

module.exports = mongoose.model('Order', orderSchema);