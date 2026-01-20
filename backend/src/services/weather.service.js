const axios = require('axios');
const { logger } = require('../utils/logger');

class WeatherService {
  constructor() {
    this.apiKey = process.env.WEATHER_API_KEY;
    this.baseUrl = 'https://api.openweathermap.org/data/2.5';
  }

  async getCurrentWeather(lat, lon) {
    try {
      const response = await axios.get(`${this.baseUrl}/weather`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: 'metric'
        }
      });

      return {
        temperature: response.data.main.temp,
        humidity: response.data.main.humidity,
        pressure: response.data.main.pressure,
        windSpeed: response.data.wind.speed,
        windDirection: response.data.wind.deg,
        description: response.data.weather[0].description,
        icon: response.data.weather[0].icon,
        location: response.data.name,
        timestamp: new Date(response.data.dt * 1000)
      };
    } catch (error) {
      logger.error('Weather API error:', error.message);
      throw new Error('Failed to fetch current weather');
    }
  }

  async getWeatherForecast(lat, lon, days = 7) {
    try {
      const response = await axios.get(`${this.baseUrl}/forecast`, {
        params: {
          lat,
          lon,
          appid: this.apiKey,
          units: 'metric',
          cnt: days * 8 // 8 forecasts per day (3-hour intervals)
        }
      });

      return response.data.list.map(item => ({
        timestamp: new Date(item.dt * 1000),
        temperature: item.main.temp,
        humidity: item.main.humidity,
        pressure: item.main.pressure,
        windSpeed: item.wind.speed,
        windDirection: item.wind.deg,
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        precipitation: item.pop * 100, // Probability of precipitation in %
        rain: item.rain ? item.rain['3h'] : 0
      }));
    } catch (error) {
      logger.error('Weather forecast API error:', error.message);
      throw new Error('Failed to fetch weather forecast');
    }
  }

  async getWeatherAlerts(lat, lon) {
    try {
      // Note: OpenWeatherMap doesn't have alerts API, this is a placeholder
      // In a real implementation, you might use a different weather service
      // that provides weather alerts

      const currentWeather = await this.getCurrentWeather(lat, lon);
      const alerts = [];

      // Simple alert logic based on current conditions
      if (currentWeather.temperature > 40) {
        alerts.push({
          type: 'heat_wave',
          severity: 'high',
          title: 'Heat Wave Alert',
          description: `Temperature is ${currentWeather.temperature}°C. Take precautions.`,
          timestamp: new Date()
        });
      }

      if (currentWeather.windSpeed > 15) {
        alerts.push({
          type: 'high_winds',
          severity: 'medium',
          title: 'High Wind Alert',
          description: `Wind speed is ${currentWeather.windSpeed} m/s. Secure loose objects.`,
          timestamp: new Date()
        });
      }

      return alerts;
    } catch (error) {
      logger.error('Weather alerts error:', error.message);
      throw new Error('Failed to fetch weather alerts');
    }
  }

  // Get agricultural weather insights
  async getAgriWeatherInsights(lat, lon) {
    try {
      const [current, forecast] = await Promise.all([
        this.getCurrentWeather(lat, lon),
        this.getWeatherForecast(lat, lon, 3)
      ]);

      const insights = {
        irrigation: this.getIrrigationAdvice(current, forecast),
        planting: this.getPlantingAdvice(current, forecast),
        harvesting: this.getHarvestingAdvice(current, forecast),
        disease: this.getDiseaseRisk(current, forecast)
      };

      return insights;
    } catch (error) {
      logger.error('Agri weather insights error:', error.message);
      throw new Error('Failed to generate agricultural weather insights');
    }
  }

  getIrrigationAdvice(current, forecast) {
    const avgTemp = forecast.slice(0, 8).reduce((sum, day) => sum + day.temperature, 0) / 8;
    const totalRain = forecast.slice(0, 8).reduce((sum, day) => sum + (day.rain || 0), 0);

    if (current.temperature > 35 && totalRain < 5) {
      return 'High irrigation needed due to heat and low rainfall';
    } else if (totalRain > 20) {
      return 'Reduce irrigation due to expected rainfall';
    }
    return 'Normal irrigation schedule recommended';
  }

  getPlantingAdvice(current, forecast) {
    const suitableDays = forecast.filter(day =>
      day.temperature >= 15 && day.temperature <= 35 &&
      day.precipitation < 30
    ).length;

    if (suitableDays >= 5) {
      return 'Good conditions for planting/sowing';
    } else if (suitableDays >= 3) {
      return 'Moderate conditions for planting';
    }
    return 'Poor conditions for planting - wait for better weather';
  }

  getHarvestingAdvice(current, forecast) {
    const dryDays = forecast.filter(day => day.precipitation < 20).length;

    if (dryDays >= 5) {
      return 'Good conditions for harvesting - low risk of spoilage';
    }
    return 'Monitor weather closely - potential harvesting delays due to rain';
  }

  getDiseaseRisk(current, forecast) {
    const humidDays = forecast.filter(day => day.humidity > 80).length;
    const rainyDays = forecast.filter(day => day.precipitation > 50).length;

    if (humidDays >= 3 && rainyDays >= 2) {
      return 'High risk of fungal diseases - consider preventive measures';
    } else if (humidDays >= 2) {
      return 'Moderate risk of fungal diseases';
    }
    return 'Low risk of fungal diseases';
  }
}

module.exports = new WeatherService();