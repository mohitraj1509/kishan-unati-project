const Crop = require('../models/Crop.model');
const { sendResponse } = require('../utils/response');
const { logger } = require('../utils/logger');
const aiService = require('../services/ai.service');

// @desc    Get all crops
// @route   GET /api/crops
// @access  Public
const getCrops = async (req, res) => {
  try {
    const crops = await Crop.find({});
    sendResponse(res, 200, true, 'Crops retrieved successfully', crops);
  } catch (error) {
    logger.error('Get crops error:', error);
    sendResponse(res, 500, false, 'Server error');
  }
};

// @desc    Get crop by ID
// @route   GET /api/crops/:id
// @access  Public
const getCropById = async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) {
      return sendResponse(res, 404, false, 'Crop not found');
    }
    sendResponse(res, 200, true, 'Crop retrieved successfully', crop);
  } catch (error) {
    logger.error('Get crop by ID error:', error);
    sendResponse(res, 500, false, 'Server error');
  }
};

// @desc    Create new crop
// @route   POST /api/crops
// @access  Private/Admin
const createCrop = async (req, res) => {
  try {
    const crop = await Crop.create(req.body);
    sendResponse(res, 201, true, 'Crop created successfully', crop);
  } catch (error) {
    logger.error('Create crop error:', error);
    sendResponse(res, 500, false, 'Server error');
  }
};

// @desc    Update crop
// @route   PUT /api/crops/:id
// @access  Private/Admin
const updateCrop = async (req, res) => {
  try {
    const crop = await Crop.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!crop) {
      return sendResponse(res, 404, false, 'Crop not found');
    }
    sendResponse(res, 200, true, 'Crop updated successfully', crop);
  } catch (error) {
    logger.error('Update crop error:', error);
    sendResponse(res, 500, false, 'Server error');
  }
};

// @desc    Delete crop
// @route   DELETE /api/crops/:id
// @access  Private/Admin
const deleteCrop = async (req, res) => {
  try {
    const crop = await Crop.findByIdAndDelete(req.params.id);
    if (!crop) {
      return sendResponse(res, 404, false, 'Crop not found');
    }
    sendResponse(res, 200, true, 'Crop deleted successfully');
  } catch (error) {
    logger.error('Delete crop error:', error);
    sendResponse(res, 500, false, 'Server error');
  }
};

// @desc    Get crop recommendations
// @route   POST /api/crops/recommendations
// @access  Private
const getCropRecommendations = async (req, res) => {
  try {
    const { soilType, location, season, weatherConditions } = req.body;

    // Use AI service to get recommendations
    const recommendations = await aiService.getCropRecommendations({
      soilType,
      location,
      season,
      weatherConditions
    });

    sendResponse(res, 200, true, 'Crop recommendations retrieved', recommendations);
  } catch (error) {
    logger.error('Get crop recommendations error:', error);
    sendResponse(res, 500, false, 'Server error');
  }
};

module.exports = {
  getCrops,
  getCropById,
  createCrop,
  updateCrop,
  deleteCrop,
  getCropRecommendations
};