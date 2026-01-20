const aiService = require('../services/ai.service');
const { sendResponse } = require('../utils/response');
const { logger } = require('../utils/logger');

// @desc    Get AI-powered crop advice
// @route   POST /api/ai/crop-advice
// @access  Private
const getCropAdvice = async (req, res) => {
  try {
    const { cropType, soilType, weatherData, userQuery } = req.body;

    const advice = await aiService.generateCropAdvice({
      cropType,
      soilType,
      weatherData,
      userQuery
    });

    sendResponse(res, 200, true, 'Crop advice generated successfully', advice);
  } catch (error) {
    logger.error('Get crop advice error:', error);
    sendResponse(res, 500, false, 'Failed to generate crop advice');
  }
};

// @desc    Analyze crop/soil image
// @route   POST /api/ai/analyze-image
// @access  Private
const analyzeImage = async (req, res) => {
  try {
    const { imageUrl, analysisType } = req.body;

    const analysis = await aiService.analyzeImage(imageUrl, analysisType);

    sendResponse(res, 200, true, 'Image analyzed successfully', analysis);
  } catch (error) {
    logger.error('Analyze image error:', error);
    sendResponse(res, 500, false, 'Failed to analyze image');
  }
};

// @desc    Get AI chat response
// @route   POST /api/ai/chat
// @access  Private
const getChatResponse = async (req, res) => {
  try {
    const { message, context } = req.body;

    const response = await aiService.generateChatResponse(message, context);

    sendResponse(res, 200, true, 'Chat response generated', { response });
  } catch (error) {
    logger.error('Get chat response error:', error);
    sendResponse(res, 500, false, 'Failed to generate response');
  }
};

// @desc    Get personalized recommendations
// @route   GET /api/ai/recommendations
// @access  Private
const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;

    const recommendations = await aiService.getPersonalizedRecommendations(userId);

    sendResponse(res, 200, true, 'Recommendations retrieved', recommendations);
  } catch (error) {
    logger.error('Get recommendations error:', error);
    sendResponse(res, 500, false, 'Failed to get recommendations');
  }
};

module.exports = {
  getCropAdvice,
  analyzeImage,
  getChatResponse,
  getRecommendations
};