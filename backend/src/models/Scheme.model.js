const mongoose = require('mongoose');

const schemeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add scheme name'],
    trim: true,
    unique: true
  },
  description: {
    type: String,
    required: [true, 'Please add scheme description']
  },
  category: {
    type: String,
    required: true,
    enum: ['subsidy', 'insurance', 'loan', 'training', 'infrastructure', 'marketing', 'other']
  },
  ministry: {
    type: String,
    required: true,
    enum: ['agriculture', 'rural_development', 'finance', 'commerce', 'other']
  },
  eligibilityCriteria: {
    farmerType: [{
      type: String,
      enum: ['small', 'marginal', 'medium', 'large']
    }],
    incomeLimit: {
      min: Number,
      max: Number
    },
    landSize: {
      min: Number, // in acres
      max: Number
    },
    crops: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Crop'
    }],
    states: [String], // States where scheme is applicable
    districts: [String],
    ageLimit: {
      min: Number,
      max: Number
    },
    gender: [{
      type: String,
      enum: ['male', 'female', 'other']
    }]
  },
  benefits: {
    subsidyAmount: {
      min: Number,
      max: Number,
      unit: {
        type: String,
        default: 'INR'
      }
    },
    subsidyPercentage: {
      min: Number, // 0-100
      max: Number
    },
    coverage: [String], // What is covered (seeds, equipment, etc.)
    duration: {
      type: Number, // in years
      default: 1
    }
  },
  applicationProcess: {
    online: {
      type: Boolean,
      default: true
    },
    documents: [String], // Required documents
    deadline: Date,
    applicationFee: Number
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'expired', 'upcoming'],
    default: 'active'
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  budget: {
    allocated: Number,
    utilized: Number,
    unit: {
      type: String,
      default: 'crore INR'
    }
  },
  contactInfo: {
    helpline: String,
    email: String,
    website: String
  },
  images: [{
    type: String // URLs to scheme promotional images
  }],
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for search
schemeSchema.index({ name: 'text', description: 'text', tags: 'text' });
schemeSchema.index({ category: 1, ministry: 1, status: 1 });

// Virtual for scheme duration
schemeSchema.virtual('duration').get(function() {
  if (this.endDate && this.startDate) {
    return Math.ceil((this.endDate - this.startDate) / (1000 * 60 * 60 * 24));
  }
  return null;
});

// Virtual for remaining days
schemeSchema.virtual('daysRemaining').get(function() {
  if (this.endDate) {
    const remaining = Math.ceil((this.endDate - new Date()) / (1000 * 60 * 60 * 24));
    return remaining > 0 ? remaining : 0;
  }
  return null;
});

module.exports = mongoose.model('Scheme', schemeSchema);