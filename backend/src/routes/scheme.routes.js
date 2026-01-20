const express = require('express');
const {
  getSchemes,
  getSchemeById,
  createScheme,
  updateScheme,
  deleteScheme,
  getEligibleSchemes
} = require('../controllers/scheme.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

// @route   GET /api/schemes
// @desc    Get all government schemes
// @access  Public
router.get('/', getSchemes);

// @route   GET /api/schemes/:id
// @desc    Get scheme by ID
// @access  Public
router.get('/:id', getSchemeById);

// @route   POST /api/schemes
// @desc    Create new scheme (Admin only)
// @access  Private/Admin
router.post('/', protect, createScheme);

// @route   PUT /api/schemes/:id
// @desc    Update scheme (Admin only)
// @access  Private/Admin
router.put('/:id', protect, updateScheme);

// @route   DELETE /api/schemes/:id
// @desc    Delete scheme (Admin only)
// @access  Private/Admin
router.delete('/:id', protect, deleteScheme);

// @route   GET /api/schemes/eligible
// @desc    Get schemes eligible for user
// @access  Private
router.get('/eligible', protect, getEligibleSchemes);

module.exports = router;