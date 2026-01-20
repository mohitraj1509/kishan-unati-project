const mongoose = require('mongoose');
const Scheme = require('./src/models/Scheme.model');
require('dotenv').config();

const sampleSchemes = [
  {
    name: "Pradhan Mantri Kisan Samman Nidhi (PM-KISAN)",
    description: "Direct income support scheme for farmers providing ₹6,000 per year in three equal installments to eligible farmers.",
    category: "subsidy",
    ministry: "agriculture",
    eligibilityCriteria: {
      farmerType: ["small", "marginal"],
      incomeLimit: { min: 0, max: 600000 },
      landSize: { min: 0, max: 2 },
      states: ["All States"],
      ageLimit: { min: 18, max: 100 },
      gender: ["male", "female"]
    },
    benefits: {
      subsidyAmount: { min: 2000, max: 2000, unit: "INR" },
      subsidyPercentage: null,
      coverage: ["Direct cash transfer"],
      duration: 1
    },
    applicationProcess: {
      online: true,
      documents: ["Aadhaar Card", "Bank Account Details", "Land Records"],
      deadline: null,
      applicationFee: 0
    },
    status: "active",
    startDate: new Date("2019-12-01"),
    endDate: null,
    budget: {
      allocated: 60000,
      utilized: 45000,
      unit: "crore INR"
    },
    contactInfo: {
      helpline: "011-23381092",
      email: "pmkisan@gov.in",
      website: "https://pmkisan.gov.in"
    }
  },
  {
    name: "Pradhan Mantri Fasal Bima Yojana (PMFBY)",
    description: "Comprehensive crop insurance scheme covering farmers against all non-preventable natural risks from pre-sowing to post-harvest.",
    category: "insurance",
    ministry: "agriculture",
    eligibilityCriteria: {
      farmerType: ["small", "marginal", "medium", "large"],
      incomeLimit: null,
      landSize: { min: 0, max: 100 },
      states: ["All States"],
      ageLimit: { min: 18, max: 100 },
      gender: ["male", "female"]
    },
    benefits: {
      subsidyAmount: null,
      subsidyPercentage: { min: 50, max: 90 },
      coverage: ["Crop loss due to natural calamities", "Post-harvest losses", "Prevented sowing"],
      duration: 1
    },
    applicationProcess: {
      online: true,
      documents: ["Land Records", "Crop Details", "Bank Account"],
      deadline: "2026-06-30",
      applicationFee: 0
    },
    status: "active",
    startDate: new Date("2016-04-01"),
    endDate: null,
    budget: {
      allocated: 16000,
      utilized: 12000,
      unit: "crore INR"
    },
    contactInfo: {
      helpline: "1800-11-4242",
      email: "pmfby-support@gov.in",
      website: "https://pmfby.gov.in"
    }
  },
  {
    name: "Soil Health Card Scheme",
    description: "Provides soil health cards to farmers every 3 years to enable them to apply appropriate nutrients for improving soil fertility.",
    category: "training",
    ministry: "agriculture",
    eligibilityCriteria: {
      farmerType: ["small", "marginal", "medium", "large"],
      incomeLimit: null,
      landSize: { min: 0, max: 100 },
      states: ["All States"],
      ageLimit: { min: 18, max: 100 },
      gender: ["male", "female"]
    },
    benefits: {
      subsidyAmount: { min: 0, max: 0, unit: "INR" },
      subsidyPercentage: null,
      coverage: ["Free soil testing", "Nutrient recommendations", "Fertilizer guidance"],
      duration: 3
    },
    applicationProcess: {
      online: true,
      documents: ["Land Records", "Aadhaar Card"],
      deadline: null,
      applicationFee: 0
    },
    status: "active",
    startDate: new Date("2015-02-19"),
    endDate: null,
    budget: {
      allocated: 2000,
      utilized: 1500,
      unit: "crore INR"
    },
    contactInfo: {
      helpline: "011-23381358",
      email: "soilhealth@gov.in",
      website: "https://soilhealth.dac.gov.in"
    }
  },
  {
    name: "National Agriculture Market (eNAM)",
    description: "Online trading platform connecting farmers directly with buyers, eliminating middlemen and ensuring better prices.",
    category: "marketing",
    ministry: "commerce",
    eligibilityCriteria: {
      farmerType: ["small", "marginal", "medium", "large"],
      incomeLimit: null,
      landSize: { min: 0, max: 100 },
      states: ["All States"],
      ageLimit: { min: 18, max: 100 },
      gender: ["male", "female"]
    },
    benefits: {
      subsidyAmount: null,
      subsidyPercentage: null,
      coverage: ["Better price discovery", "Direct marketing", "Reduced transaction costs"],
      duration: 1
    },
    applicationProcess: {
      online: true,
      documents: ["Aadhaar Card", "Bank Account", "Mobile Number"],
      deadline: null,
      applicationFee: 0
    },
    status: "active",
    startDate: new Date("2016-04-14"),
    endDate: null,
    budget: {
      allocated: 200,
      utilized: 150,
      unit: "crore INR"
    },
    contactInfo: {
      helpline: "011-23389684",
      email: "support@enam.gov.in",
      website: "https://enam.gov.in"
    }
  },
  {
    name: "Kisan Credit Card (KCC) Scheme",
    description: "Provides timely and adequate credit to farmers at reasonable rates for agricultural and allied activities.",
    category: "loan",
    ministry: "finance",
    eligibilityCriteria: {
      farmerType: ["small", "marginal", "medium", "large"],
      incomeLimit: null,
      landSize: { min: 0, max: 100 },
      states: ["All States"],
      ageLimit: { min: 18, max: 70 },
      gender: ["male", "female"]
    },
    benefits: {
      subsidyAmount: null,
      subsidyPercentage: null,
      coverage: ["Crop loans", "Term loans", "Working capital"],
      duration: 5
    },
    applicationProcess: {
      online: true,
      documents: ["Land Records", "Identity Proof", "Income Proof"],
      deadline: null,
      applicationFee: 0
    },
    status: "active",
    startDate: new Date("1998-08-01"),
    endDate: null,
    budget: {
      allocated: 50000,
      utilized: 35000,
      unit: "crore INR"
    },
    contactInfo: {
      helpline: "011-23389684",
      email: "kcc-support@gov.in",
      website: "https://www.rbi.org.in"
    }
  },
  {
    name: "Pradhan Mantri Krishi Sinchayi Yojana (PMKSY)",
    description: "Comprehensive irrigation scheme focusing on end-to-end solutions in irrigation supply chain.",
    category: "infrastructure",
    ministry: "rural_development",
    eligibilityCriteria: {
      farmerType: ["small", "marginal", "medium", "large"],
      incomeLimit: null,
      landSize: { min: 0, max: 100 },
      states: ["All States"],
      ageLimit: { min: 18, max: 100 },
      gender: ["male", "female"]
    },
    benefits: {
      subsidyAmount: null,
      subsidyPercentage: { min: 25, max: 90 },
      coverage: ["Drip irrigation", "Sprinkler systems", "Water conservation"],
      duration: 5
    },
    applicationProcess: {
      online: true,
      documents: ["Land Records", "Project Proposal", "Technical Feasibility"],
      deadline: null,
      applicationFee: 0
    },
    status: "active",
    startDate: new Date("2015-07-01"),
    endDate: null,
    budget: {
      allocated: 50000,
      utilized: 30000,
      unit: "crore INR"
    },
    contactInfo: {
      helpline: "011-23389684",
      email: "pmksy-support@gov.in",
      website: "https://pmksy.gov.in"
    }
  }
];

const seedSchemes = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/kisan-unnati', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing schemes
    await Scheme.deleteMany({});
    console.log('Cleared existing schemes');

    // Insert sample schemes
    const schemes = await Scheme.insertMany(sampleSchemes);
    console.log(`Seeded ${schemes.length} schemes successfully`);

    // Close connection
    await mongoose.connection.close();
    console.log('Database connection closed');

  } catch (error) {
    console.error('Error seeding schemes:', error);
    process.exit(1);
  }
};

// Run the seed function
seedSchemes();