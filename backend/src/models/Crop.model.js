const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add crop name'],
    trim: true,
    unique: true
  },
  scientificName: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['cereal', 'vegetable', 'fruit', 'pulse', 'oilseed', 'fiber', 'sugar', 'plantation']
  },
  description: {
    type: String,
    required: [true, 'Please add crop description']
  },
  images: [{
    type: String // URLs to crop images
  }],
  growingConditions: {
    climate: {
      type: String,
      enum: ['tropical', 'subtropical', 'temperate', 'arid', 'semi-arid'],
      required: true
    },
    temperature: {
      min: Number, // in Celsius
      max: Number,
      optimal: Number
    },
    rainfall: {
      min: Number, // in mm
      max: Number,
      optimal: Number
    },
    soilType: [{
      type: String,
      enum: ['clay', 'sandy', 'loamy', 'silt', 'peaty']
    }],
    soilPH: {
      min: Number,
      max: Number,
      optimal: Number
    }
  },
  cultivation: {
    season: {
      type: String,
      enum: ['kharif', 'rabi', 'zaid', 'annual', 'perennial']
    },
    duration: {
      min: Number, // in days
      max: Number
    },
    spacing: {
      rowToRow: Number, // in cm
      plantToPlant: Number
    },
    irrigation: {
      frequency: String,
      method: String
    }
  },
  yield: {
    average: Number, // in kg/acre
    unit: {
      type: String,
      default: 'kg/acre'
    }
  },
  economics: {
    costPerAcre: Number, // in INR
    expectedRevenue: Number,
    profitMargin: Number
  },
  diseases: [{
    name: String,
    symptoms: [String],
    prevention: [String],
    treatment: [String]
  }],
  pests: [{
    name: String,
    symptoms: [String],
    prevention: [String],
    control: [String]
  }],
  nutrients: {
    nitrogen: Number, // kg/acre
    phosphorus: Number,
    potassium: Number,
    organicMatter: Number
  },
  marketPrice: {
    current: Number, // in INR per kg
    trend: {
      type: String,
      enum: ['increasing', 'decreasing', 'stable']
    }
  },
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
cropSchema.index({ name: 'text', description: 'text' });
cropSchema.index({ category: 1, climate: 1 });

// Virtual for profit calculation
cropSchema.virtual('estimatedProfit').get(function() {
  if (this.economics.costPerAcre && this.yield.average && this.marketPrice.current) {
    const revenue = this.yield.average * this.marketPrice.current;
    return revenue - this.economics.costPerAcre;
  }
  return null;
});

module.exports = mongoose.model('Crop', cropSchema);