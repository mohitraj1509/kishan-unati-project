const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  rating: {
    type: Number,
    required: [true, 'Please add a rating'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  title: {
    type: String,
    required: [true, 'Please add a review title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  comment: {
    type: String,
    required: [true, 'Please add a review comment'],
    trim: true,
    maxlength: [500, 'Comment cannot be more than 500 characters']
  },
  images: [{
    type: String // URLs to review images
  }],
  verified: {
    type: Boolean,
    default: false // Verified purchase
  },
  helpful: {
    votes: {
      type: Number,
      default: 0
    },
    votedBy: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }]
  },
  response: {
    by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    comment: String,
    respondedAt: Date
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for efficient queries
reviewSchema.index({ product: 1, createdAt: -1 });
reviewSchema.index({ user: 1, product: 1 }, { unique: true }); // One review per user per product
reviewSchema.index({ rating: 1 });

// Virtual for review age
reviewSchema.virtual('reviewAge').get(function() {
  return Math.floor((Date.now() - this.createdAt) / (1000 * 60 * 60 * 24));
});

// Static method to get average rating for a product
reviewSchema.statics.getAverageRating = async function(productId) {
  const result = await this.aggregate([
    { $match: { product: mongoose.Types.ObjectId(productId), isActive: true } },
    {
      $group: {
        _id: '$product',
        averageRating: { $avg: '$rating' },
        totalReviews: { $sum: 1 },
        ratingDistribution: {
          $push: '$rating'
        }
      }
    }
  ]);

  if (result.length > 0) {
    const stats = result[0];
    const distribution = [1, 2, 3, 4, 5].map(rating => ({
      rating,
      count: stats.ratingDistribution.filter(r => r === rating).length
    }));

    return {
      averageRating: Math.round(stats.averageRating * 10) / 10,
      totalReviews: stats.totalReviews,
      distribution
    };
  }

  return {
    averageRating: 0,
    totalReviews: 0,
    distribution: [1, 2, 3, 4, 5].map(rating => ({ rating, count: 0 }))
  };
};

// Pre-save middleware to check if user has purchased the product
reviewSchema.pre('save', async function(next) {
  if (this.isNew) {
    const Order = mongoose.model('Order');
    const order = await Order.findOne({
      _id: this.order,
      buyer: this.user,
      product: this.product,
      status: { $in: ['delivered', 'confirmed'] }
    });

    if (order) {
      this.verified = true;
    }
  }
  next();
});

module.exports = mongoose.model('Review', reviewSchema);