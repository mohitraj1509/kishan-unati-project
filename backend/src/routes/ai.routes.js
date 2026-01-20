const express = require('express');
const {
  getCropAdvice,
  analyzeImage,
  getChatResponse,
  getRecommendations
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

module.exports = router;