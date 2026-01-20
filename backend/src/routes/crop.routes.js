const express = require('express');
const {
  getCrops,
  getCropById,
  createCrop,
  updateCrop,
  deleteCrop,
  getCropRecommendations
} = require('../controllers/crop.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

// @route   GET /api/crops
// @desc    Get all crops
// @access  Public
router.get('/', getCrops);

// @route   GET /api/crops/:id
// @desc    Get crop by ID
// @access  Public
router.get('/:id', getCropById);

// @route   POST /api/crops
// @desc    Create new crop
// @access  Private/Admin
router.post('/', protect, createCrop);

// @route   PUT /api/crops/:id
// @desc    Update crop
// @access  Private/Admin
router.put('/:id', protect, updateCrop);

// @route   DELETE /api/crops/:id
// @desc    Delete crop
// @access  Private/Admin
router.delete('/:id', protect, deleteCrop);

// @route   POST /api/crops/recommendations
// @desc    Get crop recommendations based on soil and weather
// @access  Private
router.post('/recommendations', protect, getCropRecommendations);

module.exports = router;