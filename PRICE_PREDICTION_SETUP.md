# Price Prediction Feature Setup Guide

This guide helps you set up the complete **Price Prediction** feature for Kisan Unnati, which includes AI-powered crop price forecasting.

## 📋 Overview

The Price Prediction feature has three main components:

### 1. **Frontend** (Next.js + TypeScript)
- Located in: `frontend/`
- Components:
  - `components/PricePredictionModal.tsx` - Main modal UI
  - `components/PricePredictionCard.tsx` - Price display card
  - `components/RiskIndicator.tsx` - Risk level indicator
  - `components/PriceChart.tsx` - Price trend visualization
  - `lib/aiPriceService.ts` - API service layer

### 2. **Backend** (Node.js Express)
- Located in: `backend/`
- New files to create:
  - `src/routes/aiPriceRoutes.js`
  - `src/controllers/aiPriceController.js`
  - `src/services/aiPriceService.js`

### 3. **AI Service** (Python FastAPI)
- Located in: `ai-services/`
- New files to create:
  - `ai_price_api.py` - Price prediction API
  - `crop_recommendation/price_model.py` - ML model
  - `crop_recommendation/risk_engine.py` - Risk assessment

---

## 🚀 Quick Start

### Step 1: Frontend Setup (Already Done ✅)

Dependencies installed:
- `axios` - HTTP client
- `recharts` - Charts & visualization

The Price Prediction feature is now integrated into the dashboard as a new Quick Action button.

### Step 2: Backend Setup

1. **Create Backend Routes** - `backend/src/routes/aiPriceRoutes.js`:

```javascript
const express = require('express');
const router = express.Router();
const controller = require('../controllers/aiPriceController');

// Price prediction endpoints
router.get('/predict-price', controller.predictPrice);
router.get('/price-history', controller.getPriceHistory);
router.get('/risk-assessment', controller.getRiskAssessment);

module.exports = router;
```

2. **Create Backend Controller** - `backend/src/controllers/aiPriceController.js`:

```javascript
const aiService = require('../services/aiPriceService');

exports.predictPrice = async (req, res) => {
  try {
    const { crop, district, arrival_quantity = 1000 } = req.query;

    if (!crop || !district) {
      return res.status(400).json({ 
        message: 'crop and district parameters are required' 
      });
    }

    const data = await aiService.getPrediction(crop, district, arrival_quantity);
    res.json(data);
  } catch (error) {
    console.error('AI service error:', error);
    res.status(500).json({ message: 'AI service error' });
  }
};

exports.getPriceHistory = async (req, res) => {
  try {
    const { crop, district, months = 12 } = req.query;
    const data = await aiService.getPriceHistory(crop, district, months);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch price history' });
  }
};

exports.getRiskAssessment = async (req, res) => {
  try {
    const { crop, district } = req.query;
    const data = await aiService.getRiskAssessment(crop, district);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch risk assessment' });
  }
};
```

3. **Create Backend Service** - `backend/src/services/aiPriceService.js`:

```javascript
const axios = require('axios');

const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:5000';

exports.getPrediction = async (crop, district, arrivalQuantity = 1000) => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/api/predict-price`, {
      params: { crop, district, arrival_quantity: arrivalQuantity },
      timeout: 10000
    });
    return response.data;
  } catch (error) {
    console.error('Error calling AI service:', error.message);
    throw new Error('Failed to get price prediction from AI service');
  }
};

exports.getPriceHistory = async (crop, district, months = 12) => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/api/price-history`, {
      params: { crop, district, months },
      timeout: 10000
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching price history:', error.message);
    return generateMockHistory(months);
  }
};

exports.getRiskAssessment = async (crop, district) => {
  try {
    const response = await axios.get(`${AI_SERVICE_URL}/api/risk-assessment`, {
      params: { crop, district },
      timeout: 10000
    });
    return response.data;
  } catch (error) {
    return { risk_level: 'Medium', factors: [] };
  }
};

function generateMockHistory(months) {
  const data = [];
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  for (let i = 0; i < months; i++) {
    data.push({
      month: monthNames[i % 12],
      price: 2000 + Math.random() * 500
    });
  }
  return data;
}
```

4. **Update Backend App** - Add to `backend/src/app.js`:

```javascript
// Add after other route definitions
app.use('/api/ai', require('./routes/aiPriceRoutes'));
```

### Step 3: Python AI Service Setup

1. **Create AI API** - `ai-services/ai_price_api.py`:

```python
from fastapi import FastAPI
import joblib
import datetime
from crop_recommendation.risk_engine import calculate_oversupply_risk

app = FastAPI()

MODEL_PATH = "crop_recommendation/price_model.pkl"

@app.get("/api/predict-price")
async def predict_price(crop: str, district: str, arrival_quantity: int = 1000):
    try:
        model, crop_encoder, district_encoder = joblib.load(MODEL_PATH)
        
        month = datetime.datetime.now().month
        crop_encoded = crop_encoder.transform([crop])[0]
        district_encoded = district_encoder.transform([district])[0]
        
        price = model.predict([[crop_encoded, district_encoded, month, arrival_quantity]])
        risk = calculate_oversupply_risk(12000, 10000)
        
        return {
            "predicted_price": float(price[0]),
            "risk_level": risk,
            "confidence": 0.85
        }
    except Exception as e:
        return {
            "predicted_price": 2450,
            "risk_level": "Medium",
            "confidence": 0.75,
            "error": str(e)
        }

@app.get("/api/price-history")
async def price_history(crop: str, district: str, months: int = 12):
    # Mock data - Replace with real database
    import random
    data = []
    month_names = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    
    for i in range(months):
        data.append({
            "month": month_names[i % 12],
            "price": 2000 + random.uniform(0, 500)
        })
    return data

@app.get("/api/risk-assessment")
async def risk_assessment(crop: str, district: str):
    risk = calculate_oversupply_risk(12000, 10000)
    return {
        "risk_level": risk,
        "factors": [
            "Market volatility: 25%",
            "Supply variation: 18%",
            "Seasonal demand: 12%"
        ]
    }
```

2. **Create Price Model** - `ai-services/crop_recommendation/price_model.py`:

```python
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
import joblib
import os

MODEL_PATH = "crop_recommendation/price_model.pkl"

def train_model():
    # Create sample CSV if not exists
    df = pd.read_csv("crop_recommendation/data/mandi_prices.csv")
    df.dropna(inplace=True)
    
    df["month"] = pd.to_datetime(df["date"]).dt.month
    
    crop_encoder = LabelEncoder()
    district_encoder = LabelEncoder()
    
    df["crop"] = crop_encoder.fit_transform(df["crop"])
    df["district"] = district_encoder.fit_transform(df["district"])
    
    X = df[["crop", "district", "month", "arrival_quantity"]]
    y = df["modal_price"]
    
    model = RandomForestRegressor(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    os.makedirs("crop_recommendation", exist_ok=True)
    joblib.dump((model, crop_encoder, district_encoder), MODEL_PATH)
    print(f"Model trained and saved to {MODEL_PATH}")

if __name__ == "__main__":
    train_model()
```

3. **Create Risk Engine** - `ai-services/crop_recommendation/risk_engine.py`:

```python
def calculate_oversupply_risk(current_area, last_year_area):
    """Calculate crop oversupply risk based on area changes"""
    if last_year_area == 0:
        return "Medium"
    
    increase = ((current_area - last_year_area) / last_year_area) * 100
    
    if increase > 20:
        return "High"
    elif 10 <= increase <= 20:
        return "Medium"
    else:
        return "Low"
```

4. **Update AI Requirements** - `ai-services/requirements.txt`:

```
fastapi==0.104.0
uvicorn==0.24.0
pandas==2.0.0
scikit-learn==1.3.0
joblib==1.3.0
numpy==1.24.0
python-multipart==0.0.6
```

---

## 🔧 Configuration

### Environment Variables

**Frontend** - `frontend/.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_AI_PRICE_API_URL=http://localhost:5000/api
```

**Backend** - `backend/.env`:
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/kisan-unnati
AI_SERVICE_URL=http://localhost:5000
```

**AI Service** - `ai-services/.env`:
```
API_PORT=5000
MODEL_PATH=crop_recommendation/price_model.pkl
```

---

## 🎯 Running the Services

### 1. Start Frontend
```bash
cd frontend
npm run dev
# Runs on http://localhost:3002
```

### 2. Start Backend
```bash
cd backend
npm install
npm start
# Runs on http://localhost:3001
```

### 3. Start AI Service
```bash
cd ai-services
pip install -r requirements.txt
python -m uvicorn ai_price_api:app --reload --port 5000
# Runs on http://localhost:5000
```

---

## 📊 Testing the Feature

1. Go to **Dashboard** → **Quick Actions**
2. Click on **"Price Prediction"** button (📈)
3. Select a crop and district
4. Click **"Predict Price"**
5. View:
   - Predicted price
   - Risk level assessment
   - Price trend chart
   - Forecast range

---

## 🐛 Troubleshooting

### "Cannot find module 'recharts'"
```bash
cd frontend
npm install recharts
```

### AI Service connection error
- Ensure AI service is running on port 5000
- Check `NEXT_PUBLIC_AI_PRICE_API_URL` environment variable
- Verify backend AI service endpoint in `aiPriceService.js`

### Model not found error
```bash
cd ai-services
python crop_recommendation/train_price_model.py
```

---

## 📈 Next Steps

1. **Get Real Data**: Replace mock data with actual Agmarknet or government agricultural data
2. **Improve Model**: Train with more historical data for better accuracy
3. **Add Notifications**: Notify farmers when prices reach favorable levels
4. **Mobile App**: Extend to mobile application
5. **Real-time Updates**: Implement WebSocket for live price updates

---

## 📚 Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Recharts Documentation](https://recharts.org/)
- [Scikit-learn ML Models](https://scikit-learn.org/)
- [Agmarknet API](https://agmarknet.gov.in/)

---

## 👨‍💻 Support

For issues or questions:
1. Check the logs in each service
2. Verify all environment variables
3. Ensure all services are running
4. Check network connectivity between services

