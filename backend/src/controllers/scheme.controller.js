const Scheme = require('../models/Scheme.model');
const User = require('../models/User.model');
const { sendResponse } = require('../utils/response');
const { logger } = require('../utils/logger');

// @desc    Get all schemes
// @route   GET /api/schemes
// @access  Public
const getSchemes = async (req, res) => {
  try {
    const { category, ministry, status, page = 1, limit = 10 } = req.query;

    let query = { isActive: true };

    if (category) query.category = category;
    if (ministry) query.ministry = ministry;
    if (status) query.status = status;

    const schemes = await Scheme.find(query)
      .populate('createdBy', 'name')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Scheme.countDocuments(query);

    sendResponse(res, 200, true, 'Schemes retrieved successfully', {
      schemes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Get schemes error:', error);
    sendResponse(res, 500, false, 'Server error');
  }
};

// @desc    Get scheme by ID
// @route   GET /api/schemes/:id
// @access  Public
const getSchemeById = async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id)
      .populate('createdBy', 'name')
      .populate('eligibilityCriteria.crops', 'name category');

    if (!scheme) {
      return sendResponse(res, 404, false, 'Scheme not found');
    }

    sendResponse(res, 200, true, 'Scheme retrieved successfully', scheme);
  } catch (error) {
    logger.error('Get scheme by ID error:', error);
    sendResponse(res, 500, false, 'Server error');
  }
};

// @desc    Create new scheme (Admin only)
// @route   POST /api/schemes
// @access  Private/Admin
const createScheme = async (req, res) => {
  try {
    const schemeData = {
      ...req.body,
      createdBy: req.user._id
    };

    const scheme = await Scheme.create(schemeData);
    await scheme.populate('createdBy', 'name');

    sendResponse(res, 201, true, 'Scheme created successfully', scheme);
  } catch (error) {
    logger.error('Create scheme error:', error);
    sendResponse(res, 500, false, 'Server error');
  }
};

// @desc    Update scheme (Admin only)
// @route   PUT /api/schemes/:id
// @access  Private/Admin
const updateScheme = async (req, res) => {
  try {
    const scheme = await Scheme.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name');

    if (!scheme) {
      return sendResponse(res, 404, false, 'Scheme not found');
    }

    sendResponse(res, 200, true, 'Scheme updated successfully', scheme);
  } catch (error) {
    logger.error('Update scheme error:', error);
    sendResponse(res, 500, false, 'Server error');
  }
};

// @desc    Delete scheme (Admin only)
// @route   DELETE /api/schemes/:id
// @access  Private/Admin
const deleteScheme = async (req, res) => {
  try {
    const scheme = await Scheme.findByIdAndDelete(req.params.id);

    if (!scheme) {
      return sendResponse(res, 404, false, 'Scheme not found');
    }

    sendResponse(res, 200, true, 'Scheme deleted successfully');
  } catch (error) {
    logger.error('Delete scheme error:', error);
    sendResponse(res, 500, false, 'Server error');
  }
};

// @desc    Get eligible schemes for user
// @route   GET /api/schemes/eligible
// @access  Private
const getEligibleSchemes = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return sendResponse(res, 404, false, 'User not found');
    }

    // Build eligibility query based on user profile
    let query = { isActive: true, status: 'active' };

    // Add location-based filtering
    if (user.location.state) {
      query['eligibilityCriteria.states'] = user.location.state;
    }

    // Add farmer type filtering (simplified logic)
    if (user.farmDetails && user.farmDetails.size) {
      if (user.farmDetails.size < 1) {
        query['eligibilityCriteria.farmerType'] = 'marginal';
      } else if (user.farmDetails.size < 2) {
        query['eligibilityCriteria.farmerType'] = 'small';
      } else if (user.farmDetails.size < 10) {
        query['eligibilityCriteria.farmerType'] = 'medium';
      } else {
        query['eligibilityCriteria.farmerType'] = 'large';
      }
    }

    const schemes = await Scheme.find(query)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });

    // Filter schemes based on more detailed criteria
    const eligibleSchemes = schemes.filter(scheme => {
      const criteria = scheme.eligibilityCriteria;

      // Check land size
      if (criteria.landSize) {
        const userLandSize = user.farmDetails?.size || 0;
        if (userLandSize < criteria.landSize.min || userLandSize > criteria.landSize.max) {
          return false;
        }
      }

      // Check crops
      if (criteria.crops && criteria.crops.length > 0) {
        const userCrops = user.farmDetails?.crops || [];
        const hasMatchingCrop = criteria.crops.some(cropId =>
          userCrops.includes(cropId.toString())
        );
        if (!hasMatchingCrop) {
          return false;
        }
      }

      return true;
    });

    sendResponse(res, 200, true, 'Eligible schemes retrieved successfully', eligibleSchemes);
  } catch (error) {
    logger.error('Get eligible schemes error:', error);
    sendResponse(res, 500, false, 'Server error');
  }
};

module.exports = {
  getSchemes,
  getSchemeById,
  createScheme,
  updateScheme,
  deleteScheme,
  getEligibleSchemes
};