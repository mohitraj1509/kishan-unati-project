const weatherService = require('../services/weather.service');
const { sendResponse } = require('../utils/response');
const { logger } = require('../utils/logger');

// @desc    Get current weather for user's location
// @route   GET /api/weather/current
// @access  Private
const getCurrentWeather = async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      // Try to get location from user profile
      if (req.user && req.user.location && req.user.location.coordinates) {
        const [longitude, latitude] = req.user.location.coordinates;
        const weather = await weatherService.getCurrentWeather(latitude, longitude);
        return sendResponse(res, 200, true, 'Current weather retrieved successfully', weather);
      } else {
        return sendResponse(res, 400, false, 'Location coordinates required');
      }
    }

    const weather = await weatherService.getCurrentWeather(parseFloat(lat), parseFloat(lon));
    sendResponse(res, 200, true, 'Current weather retrieved successfully', weather);
  } catch (error) {
    logger.error('Get current weather error:', error);
    sendResponse(res, 500, false, 'Failed to fetch current weather');
  }
};

// @desc    Get weather forecast
// @route   GET /api/weather/forecast
// @access  Private
const getWeatherForecast = async (req, res) => {
  try {
    const { lat, lon, days = 7 } = req.query;

    if (!lat || !lon) {
      // Try to get location from user profile
      if (req.user && req.user.location && req.user.location.coordinates) {
        const [longitude, latitude] = req.user.location.coordinates;
        const forecast = await weatherService.getWeatherForecast(latitude, longitude, parseInt(days));
        return sendResponse(res, 200, true, 'Weather forecast retrieved successfully', forecast);
      } else {
        return sendResponse(res, 400, false, 'Location coordinates required');
      }
    }

    const forecast = await weatherService.getWeatherForecast(
      parseFloat(lat),
      parseFloat(lon),
      parseInt(days)
    );
    sendResponse(res, 200, true, 'Weather forecast retrieved successfully', forecast);
  } catch (error) {
    logger.error('Get weather forecast error:', error);
    sendResponse(res, 500, false, 'Failed to fetch weather forecast');
  }
};

// @desc    Get weather alerts
// @route   GET /api/weather/alerts
// @access  Private
const getWeatherAlerts = async (req, res) => {
  try {
    const { lat, lon } = req.query;

    if (!lat || !lon) {
      // Try to get location from user profile
      if (req.user && req.user.location && req.user.location.coordinates) {
        const [longitude, latitude] = req.user.location.coordinates;
        const alerts = await weatherService.getWeatherAlerts(latitude, longitude);
        return sendResponse(res, 200, true, 'Weather alerts retrieved successfully', alerts);
      } else {
        return sendResponse(res, 400, false, 'Location coordinates required');
      }
    }

    const alerts = await weatherService.getWeatherAlerts(parseFloat(lat), parseFloat(lon));
    sendResponse(res, 200, true, 'Weather alerts retrieved successfully', alerts);
  } catch (error) {
    logger.error('Get weather alerts error:', error);
    sendResponse(res, 500, false, 'Failed to fetch weather alerts');
  }
};

module.exports = {
  getCurrentWeather,
  getWeatherForecast,
  getWeatherAlerts
};