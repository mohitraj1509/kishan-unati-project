const express = require('express');
const {
  getCurrentWeather,
  getWeatherForecast,
  getWeatherAlerts
} = require('../controllers/weather.controller');
const { protect } = require('../middlewares/auth.middleware');

const router = express.Router();

// @route   GET /api/weather/current
// @desc    Get current weather for user's location
// @access  Private
router.get('/current', protect, getCurrentWeather);

// @route   GET /api/weather/forecast
// @desc    Get weather forecast
// @access  Private
router.get('/forecast', protect, getWeatherForecast);

// @route   GET /api/weather/alerts
// @desc    Get weather alerts
// @access  Private
router.get('/alerts', protect, getWeatherAlerts);

module.exports = router;