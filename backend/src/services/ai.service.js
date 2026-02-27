const OpenAI = require('openai');
const { logger } = require('../utils/logger');

class AIService {
  constructor() {
    if (process.env.OPENAI_API_KEY) {
      this.openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY
      });
    } else {
      this.openai = null;
      logger.warn('OpenAI API key not provided - AI features will be disabled');
    }
  }

  async generateCropAdvice({ cropType, soilType, weatherData, userQuery }) {
    try {
      if (!this.openai) {
        return {
          advice: 'AI service is currently unavailable. Please try again later.',
          cropType,
          soilType,
          generatedAt: new Date()
        };
      }
      const prompt = `
        You are an agricultural expert AI assistant. Provide detailed, practical advice for farmers.

        Crop: ${cropType}
        Soil Type: ${soilType}
        Current Weather: ${JSON.stringify(weatherData)}
        Farmer's Question: ${userQuery}

        Provide comprehensive advice including:
        1. Current crop health assessment
        2. Irrigation recommendations
        3. Fertilizer/pest management suggestions
        4. Harvest timing
        5. Risk factors and preventive measures

        Keep the response practical, actionable, and farmer-friendly.
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 1000,
        temperature: 0.7
      });

      return {
        advice: response.choices[0].message.content,
        cropType,
        soilType,
        generatedAt: new Date()
      };
    } catch (error) {
      logger.error('AI crop advice error:', error.message);
      throw new Error('Failed to generate crop advice');
    }
  }

  async analyzeImage(imageUrl, analysisType) {
    try {
      if (!this.openai) {
        return {
          analysis: 'AI image analysis is currently unavailable. Please try again later.',
          analysisType,
          imageUrl,
          analyzedAt: new Date()
        };
      }
      const prompt = `
        Analyze this agricultural image for ${analysisType}.
        Image URL: ${imageUrl}

        Provide detailed analysis including:
        1. What you observe in the image
        2. Health status assessment
        3. Any visible problems or diseases
        4. Recommendations for treatment/improvement
        5. Preventive measures

        Be specific and provide actionable insights.
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-vision-preview',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              { type: 'image_url', image_url: { url: imageUrl } }
            ]
          }
        ],
        max_tokens: 1000,
        temperature: 0.3
      });

      return {
        analysis: response.choices[0].message.content,
        analysisType,
        imageUrl,
        analyzedAt: new Date()
      };
    } catch (error) {
      logger.error('AI image analysis error:', error.message);
      throw new Error('Failed to analyze image');
    }
  }

  async generateChatResponse(message, context = {}) {
    try {
      if (!this.openai) {
        return 'AI chat service is currently unavailable. Please try again later.';
      }
      const systemPrompt = `
        You are Kisan AI, an intelligent agricultural assistant for Indian farmers.
        You provide helpful, accurate, and culturally appropriate advice on farming,
        crop management, weather, market prices, and government schemes.

        Context: ${JSON.stringify(context)}

        Always respond in a friendly, supportive manner. Use simple language.
        Include relevant emojis where appropriate. Be concise but comprehensive.
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7
      });

      return response.choices[0].message.content;
    } catch (error) {
      logger.error('AI chat response error:', error.message);
      throw new Error('Failed to generate chat response');
    }
  }

  async getPersonalizedRecommendations(userId) {
    try {
      // In a real implementation, you'd fetch user data from database
      // For now, return mock recommendations
      const recommendations = [
        {
          type: 'crop_rotation',
          title: 'Consider Crop Rotation',
          description: 'Rotate your crops to maintain soil fertility and reduce pest problems.',
          priority: 'high',
          category: 'soil_management'
        },
        {
          type: 'organic_fertilizer',
          title: 'Use Organic Fertilizers',
          description: 'Switch to organic fertilizers to improve soil health and reduce chemical dependency.',
          priority: 'medium',
          category: 'fertilizer'
        },
        {
          type: 'water_management',
          title: 'Implement Water Conservation',
          description: 'Use drip irrigation to save water and improve crop yield.',
          priority: 'high',
          category: 'irrigation'
        }
      ];

      return {
        userId,
        recommendations,
        generatedAt: new Date()
      };
    } catch (error) {
      logger.error('Personalized recommendations error:', error.message);
      throw new Error('Failed to get personalized recommendations');
    }
  }

  async getCropRecommendations({ soilType, location, season, weatherConditions }) {
    try {
      if (!this.openai) {
        return {
          recommendations: 'AI crop recommendation service is currently unavailable. Please try again later.',
          criteria: { soilType, location, season, weatherConditions },
          generatedAt: new Date()
        };
      }
      const prompt = `
        Recommend suitable crops for:
        - Soil Type: ${soilType}
        - Location: ${location}
        - Season: ${season}
        - Weather Conditions: ${JSON.stringify(weatherConditions)}

        Provide 3-5 crop recommendations with:
        1. Crop name and why it's suitable
        2. Expected yield
        3. Risk factors
        4. Profitability estimate

        Focus on crops commonly grown in Indian agriculture.
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 800,
        temperature: 0.6
      });

      return {
        recommendations: response.choices[0].message.content,
        criteria: { soilType, location, season, weatherConditions },
        generatedAt: new Date()
      };
    } catch (error) {
      logger.error('Crop recommendations error:', error.message);
      throw new Error('Failed to get crop recommendations');
    }
  }

  async predictMarketPrices(cropType, timeframe = 'next_month') {
    try {
      // This would typically use historical data and ML models
      // For now, return mock predictions
      const predictions = {
        cropType,
        timeframe,
        currentPrice: 25, // INR per kg
        predictedPrice: 28,
        confidence: 0.75,
        factors: [
          'Good monsoon expected',
          'Increased demand from urban areas',
          'Stable international prices'
        ],
        recommendations: [
          'Hold current stock',
          'Consider selling in 2 weeks',
          'Monitor weather updates'
        ]
      };

      return predictions;
    } catch (error) {
      logger.error('Market price prediction error:', error.message);
      throw new Error('Failed to predict market prices');
    }
  }

  async getPricePrediction(crop, district, arrivalQuantity = 1000) {
    try {
      // Call Python AI service
      const axios = require('axios');
      const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:5000';

      try {
        const response = await axios.get(`${aiServiceUrl}/api/predict-price`, {
          params: { crop, district, arrival_quantity: arrivalQuantity },
          timeout: 10000
        });
        return response.data;
      } catch (aiError) {
        // Fallback to mock data if AI service is unavailable
        logger.warn(`AI service unavailable, using mock data for crop: ${crop}`);
        return {
          predicted_price: this._generateMockPrice(crop),
          risk_level: this._generateMockRisk(),
          confidence: 0.75,
          historical_avg: this._generateMockHistoricalPrice(crop),
          forecast_range: {
            min: this._generateMockPrice(crop) - 500,
            max: this._generateMockPrice(crop) + 500
          },
          note: 'This is mock data. Real data will be available when AI service is connected.'
        };
      }
    } catch (error) {
      logger.error('Get price prediction error:', error.message);
      throw new Error('Failed to get price prediction');
    }
  }

  async getPriceHistory(crop, district, months = 12) {
    try {
      const axios = require('axios');
      const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:5000';

      try {
        const response = await axios.get(`${aiServiceUrl}/api/price-history`, {
          params: { crop, district, months },
          timeout: 10000
        });
        return response.data;
      } catch (aiError) {
        // Fallback to mock data
        logger.warn(`AI service unavailable, using mock history data for crop: ${crop}`);
        return this._generateMockPriceHistory(months);
      }
    } catch (error) {
      logger.error('Get price history error:', error.message);
      throw new Error('Failed to get price history');
    }
  }

  async getRiskAssessment(crop, district) {
    try {
      const axios = require('axios');
      const aiServiceUrl = process.env.AI_SERVICE_URL || 'http://localhost:5000';

      try {
        const response = await axios.get(`${aiServiceUrl}/api/risk-assessment`, {
          params: { crop, district },
          timeout: 10000
        });
        return response.data;
      } catch (aiError) {
        // Fallback to mock data
        logger.warn(`AI service unavailable, using mock risk data for crop: ${crop}`);
        return {
          risk_level: this._generateMockRisk(),
          factors: [
            'Market volatility: 25%',
            'Supply variation: 18%',
            'Seasonal demand: 12%'
          ]
        };
      }
    } catch (error) {
      logger.error('Get risk assessment error:', error.message);
      throw new Error('Failed to get risk assessment');
    }
  }

  // Helper methods for mock data
  _generateMockPrice(crop) {
    const basePrices = {
      wheat: 2400,
      rice: 2200,
      corn: 1800,
      cotton: 5500,
      sugarcane: 3200,
      pulses: 4500,
      oilseeds: 4200,
      potato: 1200
    };
    
    const basePrice = basePrices[crop.toLowerCase()] || 2500;
    const variation = (Math.random() - 0.5) * 500;
    return Math.round(basePrice + variation);
  }

  _generateMockHistoricalPrice(crop) {
    return Math.round(this._generateMockPrice(crop) * (0.85 + Math.random() * 0.15));
  }

  _generateMockRisk() {
    const risks = ['Low', 'Medium', 'High'];
    return risks[Math.floor(Math.random() * risks.length)];
  }

  _generateMockPriceHistory(months) {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const history = [];

    for (let i = Math.max(0, months - 12); i < months; i++) {
      const monthIndex = i % 12;
      history.push({
        month: monthNames[monthIndex],
        price: 2000 + Math.random() * 500
      });
    }

    return history;
  }

}

module.exports = new AIService();