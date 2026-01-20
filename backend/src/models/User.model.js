const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
    trim: true,
    maxlength: [50, 'Name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    lowercase: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include password in queries by default
  },
  phone: {
    type: String,
    required: [true, 'Please add a phone number'],
    match: [/^\+?[\d\s\-\(\)]{10,15}$/, 'Please add a valid phone number']
  },
  location: {
    address: {
      type: String,
      default: ''
    },
    district: {
      type: String,
      default: ''
    },
    state: {
      type: String,
      default: ''
    },
    pincode: {
      type: String,
      default: ''
    }
  },
  role: {
    type: String,
    enum: ['farmer', 'buyer', 'admin', 'agricultural-expert'],
    default: 'farmer'
  },
  profilePicture: {
    type: String,
    default: null
  },
  farmDetails: {
    size: Number, // in acres
    soilType: {
      type: String,
      enum: ['clay', 'sandy', 'loamy', 'silt', 'peaty']
    },
    irrigationType: {
      type: String,
      enum: ['rainfed', 'canal', 'borewell', 'tube_well', 'tank']
    },
    crops: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Crop'
    }]
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  rewards: {
    points: {
      type: Number,
      default: 0
    },
    badges: [{
      name: String,
      earnedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  preferences: {
    language: {
      type: String,
      enum: ['en', 'hi', 'te', 'ta'],
      default: 'en'
    },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      push: { type: Boolean, default: true }
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for geospatial queries
// userSchema.index({ location: '2dsphere' });

// Virtual for full address
userSchema.virtual('fullAddress').get(function() {
  return `${this.location.address}, ${this.location.district}, ${this.location.state} - ${this.location.pincode}`;
});

// Encrypt password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Match user entered password to hashed password in database
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Remove password from JSON output
userSchema.methods.toJSON = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

module.exports = mongoose.model('User', userSchema);