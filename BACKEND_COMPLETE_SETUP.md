# 🚀 Complete Price Prediction Feature - Setup Guide

## Overview

Your **Price Prediction** feature is now fully implemented across:
- ✅ **Frontend** (Next.js + React) - Complete
- ✅ **Backend** (Node.js/Express) - Complete  
- ✅ **AI Service** (Python/FastAPI) - Complete

---

## 🔧 Backend Setup

### ✅ Already Done!

The following files have been created/updated:

1. **backend/src/routes/ai.routes.js** - ✅ Updated
   - Added `/predict-price` route
   - Added `/price-history` route
   - Added `/risk-assessment` route

2. **backend/src/controllers/ai.controller.js** - ✅ Updated
   - Added `getPricePrediction` controller
   - Added `getPriceHistory` controller
   - Added `getRiskAssessment` controller

3. **backend/src/services/ai.service.js** - ✅ Updated
   - Added `getPricePrediction` method
   - Added `getPriceHistory` method
   - Added `getRiskAssessment` method
   - Added helper methods for mock data fallback
   - Fallback to mock data if AI service is unavailable

### Backend Features:
- ✅ Axios HTTP client for calling Python AI service
- ✅ Graceful error handling with mock data fallback
- ✅ Logging for debugging
- ✅ Response formatting with `sendResponse` utility
- ✅ No authentication required for price endpoints (Public API)

---

## 🐍 Python AI Service Setup

### ✅ Already Created!

The following Python files have been created:

1. **ai-services/ai_price_api.py** - FastAPI server
   ```
   Features:
   - GET /api/predict-price - Price prediction endpoint
   - GET /api/price-history - Historical price data
   - GET /api/risk-assessment - Risk analysis
   - GET /health - Health check
   - POST /api/train-model - Model training
   ```

2. **ai-services/crop_recommendation/price_model.py** - ML Model
   ```
   Features:
   - Load pre-trained model
   - Train new model from CSV data
   - Predict prices with RandomForest
   - Mock price generation for testing
   - Encoder management (crops & districts)
   ```

3. **ai-services/crop_recommendation/risk_engine.py** - Risk Analysis
   ```
   Features:
   - Calculate oversupply risk
   - Calculate market volatility
   - Calculate seasonal demand risk
   - Generate risk factors
   - Generate recommendations
   ```

4. **ai-services/train_price_model.py** - Training script
   ```
   Usage:
   python train_price_model.py
   ```

### Dependencies: ✅ All in requirements.txt
```
fastapi==0.104.1
uvicorn==0.24.0
pandas>=1.5.0
numpy>=1.20.0
scikit-learn>=1.0.0
joblib>=1.0.0
python-multipart==0.0.6
requests>=2.28.0
```

---

## 📋 Running Everything

### 1️⃣ Start Backend
```bash
cd backend
npm install  # If not already done
npm start
# Runs on http://localhost:3001
```

### 2️⃣ Start Python AI Service
```bash
cd ai-services
# Create virtual environment (optional but recommended)
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Train model (optional - only if you have mandi_prices.csv)
python train_price_model.py

# Start API server
python -m uvicorn ai_price_api:app --reload --port 5000
# Runs on http://localhost:5000
```

### 3️⃣ Start Frontend
```bash
cd frontend
npm install  # If not already done
npm run dev
# Runs on http://localhost:3002
```

---

## 🧪 Testing the Complete Flow

### Test 1: Frontend Only (No backend needed)
```bash
# Start frontend only
cd frontend
npm run dev

# Go to http://localhost:3002
# Click "Price Prediction" in dashboard
# Use mock data ✅
```

### Test 2: With Backend (No AI service)
```bash
# Start backend
cd backend && npm start

# Start frontend
cd frontend && npm run dev

# Backend will use mock data if AI service is unavailable ✅
```

### Test 3: Full Stack (All services running)
```bash
# Terminal 1: Backend
cd backend && npm start

# Terminal 2: AI Service
cd ai-services && python -m uvicorn ai_price_api:app --reload --port 5000

# Terminal 3: Frontend
cd frontend && npm run dev

# Test at http://localhost:3002 ✅
# All three services working together!
```

---

## 🧠 API Endpoints

### Backend Endpoints:
```
GET /api/ai/predict-price?crop=Wheat&district=Hisar&arrival_quantity=1000
GET /api/ai/price-history?crop=Wheat&district=Hisar&months=12
GET /api/ai/risk-assessment?crop=Wheat&district=Hisar
```

### Python AI Service Endpoints:
```
GET /api/predict-price?crop=Wheat&district=Hisar&arrival_quantity=1000
GET /api/price-history?crop=Wheat&district=Hisar&months=12
GET /api/risk-assessment?crop=Wheat&district=Hisar
GET /health
POST /api/train-model
```

---

## 📊 Data Flow

```
Frontend (Next.js)
   ↓
   makes HTTP request to
   ↓
Backend (Node.js/Express)
   ↓
   calls Python AI Service via axios
   ↓
Python (FastAPI)
   ↓
   returns predictions
   ↓
Backend returns formatted response
   ↓
Frontend displays results
```

---

## 🐛 Troubleshooting

### Issue: "Cannot find module 'axios'" in Backend
```bash
cd backend
npm install axios
```

### Issue: "ModuleNotFoundError: No module named 'fastapi'"
```bash
cd ai-services
pip install fastapi uvicorn
```

### Issue: "Connection refused" when calling AI service
```
1. Check if AI service is running on port 5000
2. Update AI_SERVICE_URL in backend/.env if using different port
3. Backend will fallback to mock data automatically
```

### Issue: Model file not found
```
The system uses mock data automatically if model.pkl doesn't exist
To train a real model:
1. Add mandi_prices.csv in ai-services/crop_recommendation/data/
2. Run: python train_price_model.py
```

---

## ⚙️ Environment Variables

### Backend (.env)
```
PORT=3001
MONGODB_URI=mongodb://localhost:27017/kisan-unnati
AI_SERVICE_URL=http://localhost:5000
NODE_ENV=development
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_AI_PRICE_API_URL=http://localhost:5000/api
```

### AI Service (.env)
```
API_PORT=5000
MODEL_PATH=crop_recommendation/price_model.pkl
```

---

## 📁 File Structure

```
Project/
├── frontend/
│   ├── components/
│   │   ├── PricePredictionModal.tsx ✅
│   │   ├── PricePredictionCard.tsx ✅
│   │   ├── RiskIndicator.tsx ✅
│   │   └── PriceChart.tsx ✅
│   ├── lib/
│   │   ├── aiPriceService.ts ✅
│   │   └── api.ts (existing)
│   ├── app/dashboard/
│   │   └── page.tsx ✅ (updated)
│   └── package.json ✅ (updated)
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── ai.routes.js ✅ (updated)
│   │   ├── controllers/
│   │   │   └── ai.controller.js ✅ (updated)
│   │   ├── services/
│   │   │   └── ai.service.js ✅ (updated)
│   │   └── app.js (existing)
│   └── package.json (existing)
│
└── ai-services/
    ├── ai_price_api.py ✅ (NEW)
    ├── train_price_model.py ✅ (NEW)
    ├── crop_recommendation/
    │   ├── price_model.py ✅ (NEW)
    │   ├── risk_engine.py ✅ (NEW)
    │   └── data/
    │       └── mandi_prices.csv (optional)
    └── requirements.txt (existing - up to date)
```

---

## ✅ Verification Checklist

Before going to production:

- [x] Frontend components created
- [x] Backend controllers created
- [x] Backend services updated
- [x] Backend routes configured
- [x] Python AI service created
- [x] FastAPI endpoints implemented
- [x] Risk assessment engine created
- [x] Price model implementation
- [x] Mock data fallback in place
- [x] Error handling implemented
- [x] CORS configured
- [x] Logging setup
- [x] Documentation complete

---

## 🚀 Production Deployment

### Docker Setup (Optional)

Create `docker-compose.yml` in project root:
```yaml
version: '3'
services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - AI_SERVICE_URL=http://ai-service:5000
    depends_on:
      - ai-service

  ai-service:
    build: ./ai-services
    ports:
      - "5000:5000"

  frontend:
    build: ./frontend
    ports:
      - "3002:3002"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

Then run:
```bash
docker-compose up
```

---

## 📚 Documentation Files

- `README_PRICE_PREDICTION.md` - Main overview
- `PRICE_PREDICTION_QUICK_GUIDE.md` - Quick reference
- `PRICE_PREDICTION_SETUP.md` - Complete setup (this is updated version)
- `PRICE_PREDICTION_ARCHITECTURE.md` - System design
- `FILES_INDEX.md` - File reference

---

## 🎉 Summary

✅ **Frontend**: Fully implemented with UI components, charts, and modal
✅ **Backend**: Routes, controllers, and services integrated
✅ **AI Service**: Python FastAPI server with price prediction & risk analysis
✅ **Documentation**: Comprehensive guides provided
✅ **Testing**: Works with mock data immediately
✅ **Fallback**: Graceful degradation if any service is unavailable

---

## 🎯 Next Steps

1. **Test Locally**: Run all three services and test the flow
2. **Train Model**: Add real data (mandi_prices.csv) and train the model
3. **Connect APIs**: Update environment variables for production
4. **Deploy**: Deploy to cloud (AWS/Azure/GCP)
5. **Monitor**: Set up logging and monitoring

---

**You're all set! The complete price prediction feature is ready to use!** 🌾✨

