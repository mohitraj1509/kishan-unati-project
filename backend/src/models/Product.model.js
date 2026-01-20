const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add product name'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please add product description']
  },
  category: {
    type: String,
    required: true,
    enum: ['seeds', 'fertilizers', 'pesticides', 'equipment', 'crops', 'vegetables', 'fruits', 'dairy', 'other']
  },
  subcategory: String,
  images: [{
    type: String, // URLs to product images
    required: true
  }],
  price: {
    type: Number,
    required: [true, 'Please add product price'],
    min: [0, 'Price cannot be negative']
  },
  unit: {
    type: String,
    required: true,
    enum: ['kg', 'ton', 'liter', 'piece', 'dozen', 'quintal', 'acre'],
    default: 'kg'
  },
  quantity: {
    type: Number,
    required: [true, 'Please add product quantity'],
    min: [0, 'Quantity cannot be negative']
  },
  availableQuantity: {
    type: Number,
    required: true,
    min: [0, 'Available quantity cannot be negative']
  },
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    },
    address: {
      type: String,
      required: true
    },
    district: String,
    state: String
  },
  specifications: {
    brand: String,
    model: String,
    grade: String,
    quality: {
      type: String,
      enum: ['premium', 'standard', 'basic']
    },
    expiryDate: Date,
    manufacturingDate: Date
  },
  shipping: {
    freeShipping: {
      type: Boolean,
      default: false
    },
    shippingCost: {
      type: Number,
      default: 0,
      min: 0
    },
    deliveryTime: {
      min: Number, // in days
      max: Number
    }
  },
  reviews: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  views: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for geospatial queries
// productSchema.index({ location: '2dsphere' });

// Index for search
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, subcategory: 1, seller: 1 });

// Virtual for availability status
productSchema.virtual('availabilityStatus').get(function() {
  if (this.availableQuantity === 0) return 'out_of_stock';
  if (this.availableQuantity < 10) return 'low_stock';
  return 'in_stock';
});

// Pre-save middleware to calculate average rating
productSchema.pre('save', function(next) {
  if (this.reviews && this.reviews.length > 0) {
    const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
    this.averageRating = sum / this.reviews.length;
    this.totalReviews = this.reviews.length;
  }
  next();
});

module.exports = mongoose.model('Product', productSchema);