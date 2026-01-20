const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Validate required environment variables
const requiredEnvVars = [
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_EXPIRE',
  'NODE_ENV'
];

const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('Missing required environment variables:', missingEnvVars);
  process.exit(1);
}

module.exports = {
  PORT: process.env.PORT || 3001,
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRE: process.env.JWT_EXPIRE,
  NODE_ENV: process.env.NODE_ENV,
  FRONTEND_URL: process.env.FRONTEND_URL,
  REDIS_URL: process.env.REDIS_URL,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  WEATHER_API_KEY: process.env.WEATHER_API_KEY
};