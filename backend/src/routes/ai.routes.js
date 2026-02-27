const express = require('express');
const {
  getCropAdvice,
  analyzeImage,
  getChatResponse,
  getRecommendations,
  getPricePrediction,
  getPriceHistory,
  getRiskAssessment
} = require('../controllers/ai.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

// @route   POST /api/ai/crop-advice
// @desc    Get AI-powered crop advice
// @access  Private
router.post('/crop-advice', protect, getCropAdvice);

// @route   POST /api/ai/analyze-image
// @desc    Analyze crop/soil image
// @access  Private
router.post('/analyze-image', protect, analyzeImage);

// @route   POST /api/ai/chat
// @desc    Get AI chat response
// @access  Private
router.post('/chat', protect, getChatResponse);

// @route   GET /api/ai/recommendations
// @desc    Get personalized recommendations
// @access  Private
router.get('/recommendations', protect, getRecommendations);

// @route   GET /api/ai/predict-price
// @desc    Get price prediction for a crop in a district
// @access  Public
router.get('/predict-price', getPricePrediction);

// @route   GET /api/ai/price-history
// @desc    Get historical price data for a crop in a district
// @access  Public
router.get('/price-history', getPriceHistory);

// @route   GET /api/ai/risk-assessment
// @desc    Get risk assessment for a crop in a district
// @access  Public
router.get('/risk-assessment', getRiskAssessment);

module.exports = router;