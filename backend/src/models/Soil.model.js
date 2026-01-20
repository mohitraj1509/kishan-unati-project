const mongoose = require('mongoose');

const soilSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add soil name'],
    trim: true,
    unique: true
  },
  type: {
    type: String,
    required: true,
    enum: ['clay', 'sandy', 'loamy', 'silt', 'peaty', 'chalky', 'saline']
  },
  description: {
    type: String,
    required: [true, 'Please add soil description']
  },
  characteristics: {
    texture: {
      type: String,
      enum: ['coarse', 'medium', 'fine']
    },
    drainage: {
      type: String,
      enum: ['poor', 'moderate', 'good', 'excessive']
    },
    waterHoldingCapacity: {
      type: String,
      enum: ['low', 'medium', 'high']
    },
    fertility: {
      type: String,
      enum: ['low', 'medium', 'high']
    }
  },
  composition: {
    sand: {
      type: Number,
      min: 0,
      max: 100
    },
    silt: {
      type: Number,
      min: 0,
      max: 100
    },
    clay: {
      type: Number,
      min: 0,
      max: 100
    },
    organicMatter: {
      type: Number,
      min: 0,
      max: 100
    }
  },
  phRange: {
    min: {
      type: Number,
      min: 0,
      max: 14
    },
    max: {
      type: Number,
      min: 0,
      max: 14
    },
    optimal: {
      type: Number,
      min: 0,
      max: 14
    }
  },
  nutrients: {
    nitrogen: {
      status: {
        type: String,
        enum: ['deficient', 'adequate', 'excess']
      },
      level: Number
    },
    phosphorus: {
      status: {
        type: String,
        enum: ['deficient', 'adequate', 'excess']
      },
      level: Number
    },
    potassium: {
      status: {
        type: String,
        enum: ['deficient', 'adequate', 'excess']
      },
      level: Number
    },
    micronutrients: {
      iron: Number,
      zinc: Number,
      copper: Number,
      manganese: Number,
      boron: Number
    }
  },
  suitableCrops: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crop'
  }],
  unsuitableCrops: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Crop'
  }],
  management: {
    amendments: [String],
    irrigation: [String],
    tillage: [String]
  },
  regions: [{
    state: String,
    districts: [String]
  }],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for search
soilSchema.index({ name: 'text', description: 'text' });
soilSchema.index({ type: 1 });

// Virtual for soil texture class
soilSchema.virtual('textureClass').get(function() {
  const { sand = 0, silt = 0, clay = 0 } = this.composition;

  if (clay >= 40) return 'clay';
  if (sand >= 85) return 'sand';
  if (silt >= 80) return 'silt';

  if (clay >= 35 && sand >= 45) return 'loamy sand';
  if (clay >= 20 && sand >= 45) return 'sandy loam';
  if (clay >= 27 && silt >= 28) return 'silty clay';
  if (clay >= 20 && silt >= 28) return 'silty clay loam';
  if (clay >= 27 && sand < 20) return 'clay';
  if (clay >= 35 && silt < 20) return 'sandy clay';
  if (silt >= 80) return 'silt';

  return 'loam';
});

module.exports = mongoose.model('Soil', soilSchema);