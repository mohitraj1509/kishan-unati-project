const Joi = require('joi');

// User validation schemas
const userSchemas = {
  register: Joi.object({
    name: Joi.string().min(2).max(50).required().messages({
      'string.empty': 'Name is required',
      'string.min': 'Name must be at least 2 characters',
      'string.max': 'Name cannot exceed 50 characters'
    }),
    email: Joi.string().email().required().messages({
      'string.email': 'Please provide a valid email',
      'string.empty': 'Email is required'
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters',
      'string.empty': 'Password is required'
    }),
    phone: Joi.string().pattern(/^[6-9]\d{9}$/).required().messages({
      'string.pattern.base': 'Please provide a valid Indian phone number',
      'string.empty': 'Phone number is required'
    }),
    location: Joi.object({
      coordinates: Joi.array().items(Joi.number()).length(2).required(),
      address: Joi.string().required(),
      district: Joi.string().required(),
      state: Joi.string().required(),
      pincode: Joi.string().pattern(/^\d{6}$/).required()
    }).required(),
    role: Joi.string().valid('farmer', 'buyer', 'admin').default('farmer')
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  updateProfile: Joi.object({
    name: Joi.string().min(2).max(50),
    phone: Joi.string().pattern(/^[6-9]\d{9}$/),
    location: Joi.object({
      coordinates: Joi.array().items(Joi.number()).length(2),
      address: Joi.string(),
      district: Joi.string(),
      state: Joi.string(),
      pincode: Joi.string().pattern(/^\d{6}$/)
    }),
    farmDetails: Joi.object({
      size: Joi.number().min(0),
      soilType: Joi.string().valid('clay', 'sandy', 'loamy', 'silt', 'peaty'),
      irrigationType: Joi.string().valid('rainfed', 'canal', 'borewell', 'tube_well', 'tank'),
      crops: Joi.array().items(Joi.string()) // ObjectIds
    }),
    preferences: Joi.object({
      language: Joi.string().valid('en', 'hi', 'te', 'ta'),
      notifications: Joi.object({
        email: Joi.boolean(),
        sms: Joi.boolean(),
        push: Joi.boolean()
      })
    })
  }).min(1) // At least one field must be provided
};

// Product validation schemas
const productSchemas = {
  create: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().min(10).max(1000).required(),
    category: Joi.string().valid('seeds', 'fertilizers', 'pesticides', 'equipment', 'crops', 'vegetables', 'fruits', 'dairy', 'other').required(),
    subcategory: Joi.string(),
    images: Joi.array().items(Joi.string().uri()).min(1).required(),
    price: Joi.number().min(0).required(),
    unit: Joi.string().valid('kg', 'ton', 'liter', 'piece', 'dozen', 'quintal', 'acre').required(),
    quantity: Joi.number().min(1).required(),
    location: Joi.object({
      coordinates: Joi.array().items(Joi.number()).length(2).required(),
      address: Joi.string().required(),
      district: Joi.string().required(),
      state: Joi.string().required()
    }).required(),
    specifications: Joi.object({
      brand: Joi.string(),
      model: Joi.string(),
      grade: Joi.string(),
      quality: Joi.string().valid('premium', 'standard', 'basic'),
      expiryDate: Joi.date().greater('now'),
      manufacturingDate: Joi.date().less('now')
    }),
    shipping: Joi.object({
      freeShipping: Joi.boolean().default(false),
      shippingCost: Joi.number().min(0).default(0),
      deliveryTime: Joi.object({
        min: Joi.number().min(1),
        max: Joi.number().min(1)
      })
    })
  }),

  update: Joi.object({
    name: Joi.string().min(2).max(100),
    description: Joi.string().min(10).max(1000),
    category: Joi.string().valid('seeds', 'fertilizers', 'pesticides', 'equipment', 'crops', 'vegetables', 'fruits', 'dairy', 'other'),
    subcategory: Joi.string(),
    images: Joi.array().items(Joi.string().uri()).min(1),
    price: Joi.number().min(0),
    unit: Joi.string().valid('kg', 'ton', 'liter', 'piece', 'dozen', 'quintal', 'acre'),
    quantity: Joi.number().min(0),
    location: Joi.object({
      coordinates: Joi.array().items(Joi.number()).length(2),
      address: Joi.string(),
      district: Joi.string(),
      state: Joi.string()
    }),
    specifications: Joi.object({
      brand: Joi.string(),
      model: Joi.string(),
      grade: Joi.string(),
      quality: Joi.string().valid('premium', 'standard', 'basic'),
      expiryDate: Joi.date().greater('now'),
      manufacturingDate: Joi.date().less('now')
    }),
    shipping: Joi.object({
      freeShipping: Joi.boolean(),
      shippingCost: Joi.number().min(0),
      deliveryTime: Joi.object({
        min: Joi.number().min(1),
        max: Joi.number().min(1)
      })
    })
  }).min(1)
};

// Order validation schemas
const orderSchemas = {
  create: Joi.object({
    productId: Joi.string().required(), // ObjectId
    quantity: Joi.number().min(1).required(),
    paymentMethod: Joi.string().valid('card', 'upi', 'net_banking', 'wallet', 'cod').required(),
    shippingAddress: Joi.object({
      address: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      pincode: Joi.string().pattern(/^\d{6}$/).required()
    })
  }),

  updateStatus: Joi.object({
    status: Joi.string().valid('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded').required()
  })
};

// Crop validation schemas
const cropSchemas = {
  create: Joi.object({
    name: Joi.string().min(2).max(100).required(),
    scientificName: Joi.string(),
    category: Joi.string().valid('cereal', 'vegetable', 'fruit', 'pulse', 'oilseed', 'fiber', 'sugar', 'plantation').required(),
    description: Joi.string().min(10).max(1000).required(),
    images: Joi.array().items(Joi.string().uri()),
    growingConditions: Joi.object({
      climate: Joi.string().valid('tropical', 'subtropical', 'temperate', 'arid', 'semi-arid').required(),
      temperature: Joi.object({
        min: Joi.number(),
        max: Joi.number(),
        optimal: Joi.number()
      }),
      rainfall: Joi.object({
        min: Joi.number(),
        max: Joi.number(),
        optimal: Joi.number()
      }),
      soilType: Joi.array().items(Joi.string().valid('clay', 'sandy', 'loamy', 'silt', 'peaty')),
      soilPH: Joi.object({
        min: Joi.number().min(0).max(14),
        max: Joi.number().min(0).max(14),
        optimal: Joi.number().min(0).max(14)
      })
    }).required(),
    cultivation: Joi.object({
      season: Joi.string().valid('kharif', 'rabi', 'zaid', 'annual', 'perennial'),
      duration: Joi.object({
        min: Joi.number(),
        max: Joi.number()
      }),
      spacing: Joi.object({
        rowToRow: Joi.number(),
        plantToPlant: Joi.number()
      }),
      irrigation: Joi.object({
        frequency: Joi.string(),
        method: Joi.string()
      })
    }),
    yield: Joi.object({
      average: Joi.number().min(0),
      unit: Joi.string().default('kg/acre')
    }),
    economics: Joi.object({
      costPerAcre: Joi.number().min(0),
      expectedRevenue: Joi.number().min(0),
      profitMargin: Joi.number()
    })
  }),

  update: Joi.object({
    name: Joi.string().min(2).max(100),
    scientificName: Joi.string(),
    category: Joi.string().valid('cereal', 'vegetable', 'fruit', 'pulse', 'oilseed', 'fiber', 'sugar', 'plantation'),
    description: Joi.string().min(10).max(1000),
    images: Joi.array().items(Joi.string().uri()),
    growingConditions: Joi.object({
      climate: Joi.string().valid('tropical', 'subtropical', 'temperate', 'arid', 'semi-arid'),
      temperature: Joi.object({
        min: Joi.number(),
        max: Joi.number(),
        optimal: Joi.number()
      }),
      rainfall: Joi.object({
        min: Joi.number(),
        max: Joi.number(),
        optimal: Joi.number()
      }),
      soilType: Joi.array().items(Joi.string().valid('clay', 'sandy', 'loamy', 'silt', 'peaty')),
      soilPH: Joi.object({
        min: Joi.number().min(0).max(14),
        max: Joi.number().min(0).max(14),
        optimal: Joi.number().min(0).max(14)
      })
    }),
    cultivation: Joi.object({
      season: Joi.string().valid('kharif', 'rabi', 'zaid', 'annual', 'perennial'),
      duration: Joi.object({
        min: Joi.number(),
        max: Joi.number()
      }),
      spacing: Joi.object({
        rowToRow: Joi.number(),
        plantToPlant: Joi.number()
      }),
      irrigation: Joi.object({
        frequency: Joi.string(),
        method: Joi.string()
      })
    }),
    yield: Joi.object({
      average: Joi.number().min(0),
      unit: Joi.string()
    }),
    economics: Joi.object({
      costPerAcre: Joi.number().min(0),
      expectedRevenue: Joi.number().min(0),
      profitMargin: Joi.number()
    })
  }).min(1)
};

// Validation middleware
const validate = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors
      });
    }

    next();
  };
};

module.exports = {
  userSchemas,
  productSchemas,
  orderSchemas,
  cropSchemas,
  validate
};