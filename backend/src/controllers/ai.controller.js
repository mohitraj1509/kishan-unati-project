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

// @desc    Get price prediction
// @route   GET /api/ai/predict-price
// @access  Public
const getPricePrediction = async (req, res) => {
  try {
    const { crop, district, arrival_quantity = 1000 } = req.query;

    if (!crop || !district) {
      return sendResponse(res, 400, false, 'Crop and district parameters are required');
    }

    const prediction = await aiService.getPricePrediction(crop, district, arrival_quantity);

    sendResponse(res, 200, true, 'Price prediction generated successfully', prediction);
  } catch (error) {
    logger.error('Get price prediction error:', error);
    sendResponse(res, 500, false, 'Failed to generate price prediction');
  }
};

// @desc    Get price history
// @route   GET /api/ai/price-history
// @access  Public
const getPriceHistory = async (req, res) => {
  try {
    const { crop, district, months = 12 } = req.query;

    if (!crop || !district) {
      return sendResponse(res, 400, false, 'Crop and district parameters are required');
    }

    const history = await aiService.getPriceHistory(crop, district, parseInt(months));

    sendResponse(res, 200, true, 'Price history retrieved successfully', history);
  } catch (error) {
    logger.error('Get price history error:', error);
    sendResponse(res, 500, false, 'Failed to get price history');
  }
};

// @desc    Get risk assessment
// @route   GET /api/ai/risk-assessment
// @access  Public
const getRiskAssessment = async (req, res) => {
  try {
    const { crop, district } = req.query;

    if (!crop || !district) {
      return sendResponse(res, 400, false, 'Crop and district parameters are required');
    }

    const assessment = await aiService.getRiskAssessment(crop, district);

    sendResponse(res, 200, true, 'Risk assessment completed successfully', assessment);
  } catch (error) {
    logger.error('Get risk assessment error:', error);
    sendResponse(res, 500, false, 'Failed to get risk assessment');
  }
};

module.exports = {
  getCropAdvice,
  analyzeImage,
  getChatResponse,
  getRecommendations,
  getPricePrediction,
  getPriceHistory,
  getRiskAssessment
};