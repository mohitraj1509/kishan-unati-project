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
}

module.exports = new AIService();