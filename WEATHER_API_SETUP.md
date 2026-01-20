# Weather API Setup Guide

## OpenWeatherMap API Integration

This application uses the OpenWeatherMap API to provide real-time weather data and agricultural insights.

### Step 1: Get API Key
1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Create a free account
3. Go to API Keys section in your dashboard
4. Generate a new API key

### Step 2: Configure Environment
1. Create a `.env.local` file in the root directory
2. Add your API key:
   ```
   NEXT_PUBLIC_OPENWEATHER_API_KEY=your_actual_api_key_here
   ```

### Step 3: Restart Development Server
```bash
npm run dev
```

### Features Provided:
- ✅ Current weather conditions
- ✅ 5-day weather forecast
- ✅ Agricultural recommendations based on weather
- ✅ Weather alerts and warnings
- ✅ Location-based weather data

### API Limits (Free Tier):
- 1,000 calls/day
- 60 calls/minute
- Current weather, forecast, and geocoding included

### Troubleshooting:
- If weather data doesn't load, check your API key
- Ensure `.env.local` is in the root directory
- Restart the development server after adding the API key
- Check browser console for error messages

### Alternative APIs:
If you prefer other weather services:
- **WeatherAPI**: Better for agriculture-specific data
- **Tomorrow.io**: Advanced weather intelligence
- **AccuWeather**: Comprehensive weather data (paid)

The application will fallback to mock data if the API is unavailable.