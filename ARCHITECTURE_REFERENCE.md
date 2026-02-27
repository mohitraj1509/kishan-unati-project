# 🏗️ Architecture & Command Reference Guide

## System Architecture

### High-Level Flow
```
┌─────────────────────────────────────────────────────────────────┐
│                    USER INTERFACE                               │
│                   (http://localhost:3002)                      │
│                   Next.js Dashboard App                         │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Dashboard with "Price Prediction" Button               │  │
│  │  - Opens Modal with crop/district form                  │  │
│  │  - Shows predicted price                                │  │
│  │  - Displays risk assessment                             │  │
│  │  - Shows 12-month chart                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────┬───────────────────────────────────────────────────┬────┘
         │ HTTP Calls                                         │
         │ GET /api/ai/predict-price                         │
         │ GET /api/ai/price-history                         │
         │ GET /api/ai/risk-assessment                       │
         ▼                                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                   BACKEND GATEWAY                               │
│                 (http://localhost:3001)                        │
│               Express.js Node.js Server                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Routes: ai.routes.js                                   │  │
│  │ - GET /api/ai/predict-price                            │  │
│  │ - GET /api/ai/price-history                            │  │
│  │ - GET /api/ai/risk-assessment                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Controllers: ai.controller.js                          │  │
│  │ - getPricePrediction(req, res)                         │  │
│  │ - getPriceHistory(req, res)                            │  │
│  │ - getRiskAssessment(req, res)                          │  │
│  │ (Validates input, calls services)                      │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Services: ai.service.js                                │  │
│  │ - getPricePrediction()          → Calls Python         │  │
│  │ - getPriceHistory()             → Calls Python         │  │
│  │ - getRiskAssessment()           → Calls Python         │  │
│  │ - _generateMockPrice()          → Fallback             │  │
│  │ - _generateMockHistoricalPrice()→ Fallback             │  │
│  │ - _generateMockRisk()           → Fallback             │  │
│  │ - _generateMockPriceHistory()   → Fallback             │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────┬───────────────────────────────────────────────────┬────┘
         │ HTTP Calls (axios)                                │
         │ http://localhost:5000/api/...                    │
         │                                                   │
    [ERROR? Use Mock Data ✓]                                │
         │                                                   │
         ▼                                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                   AI/ML SERVICE                                 │
│                 (http://localhost:5000)                        │
│                FastAPI Python Server                           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ API Endpoints: ai_price_api.py                         │  │
│  │ - GET /health                                          │  │
│  │ - GET /api/predict-price                               │  │
│  │ - GET /api/price-history                               │  │
│  │ - GET /api/risk-assessment                             │  │
│  │ - POST /api/train-model                                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Price Model: price_model.py                            │  │
│  │ - load_model()      → Load RandomForest model          │  │
│  │ - predict_price()   → Make prediction                  │  │
│  │ - train_model()     → Train on CSV data                │  │
│  │ - generate_mock_price() → Mock prices                  │  │
│  │                                                         │  │
│  │ Risk Engine: risk_engine.py                            │  │
│  │ - calculate_oversupply_risk()                          │  │
│  │ - calculate_market_volatility_risk()                   │  │
│  │ - calculate_seasonal_demand_risk()                     │  │
│  │ - assess_overall_risk()                                │  │
│  │ - generate_recommendations()                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          ↓                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Data                                                   │  │
│  │ - Model: price_model.pkl (trained RandomForest)       │  │
│  │ - Data: mandi_prices.csv (optional, for training)     │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Component Relationships

```
Frontend (React/TypeScript)
│
├─ Components/
│  ├─ PricePredictionModal.tsx
│  │  └─ Imports: aiPriceService, PricePredictionCard, RiskIndicator, PriceChart
│  ├─ PricePredictionCard.tsx
│  ├─ RiskIndicator.tsx
│  └─ PriceChart.tsx
│
└─ lib/
   └─ aiPriceService.ts
      ├─ getPricePrediction(crop, district, arrivalQuantity)
      ├─ getPriceHistory(crop, district, months)
      └─ getRiskAssessment(crop, district)
         │
         └─ Calls: http://localhost:3001/api/ai/...

Backend (Node.js/Express)
│
├─ routes/ai.routes.js
│  ├─ GET /predict-price      → ai.controller.getPricePrediction
│  ├─ GET /price-history      → ai.controller.getPriceHistory
│  └─ GET /risk-assessment    → ai.controller.getRiskAssessment
│
├─ controllers/ai.controller.js
│  ├─ getPricePrediction(req, res)
│  │  └─ Calls: aiService.getPricePrediction()
│  ├─ getPriceHistory(req, res)
│  │  └─ Calls: aiService.getPriceHistory()
│  └─ getRiskAssessment(req, res)
│     └─ Calls: aiService.getRiskAssessment()
│
└─ services/ai.service.js
   ├─ getPricePrediction()
   │  └─ axios.get('http://localhost:5000/api/predict-price')
   │     └─ Fallback: _generateMockPrice()
   ├─ getPriceHistory()
   │  └─ axios.get('http://localhost:5000/api/price-history')
   │     └─ Fallback: _generateMockPriceHistory()
   ├─ getRiskAssessment()
   │  └─ axios.get('http://localhost:5000/api/risk-assessment')
   │     └─ Fallback: _generateMockRisk()
   └─ Helper Methods
      ├─ _generateMockPrice(crop)
      ├─ _generateMockHistoricalPrice(crop)
      ├─ _generateMockRisk()
      └─ _generateMockPriceHistory(months)

Python (FastAPI)
│
└─ ai_price_api.py
   ├─ GET /health
   │  └─ Returns: {"status": "ok"}
   ├─ GET /api/predict-price
   │  └─ Calls: price_model.predict_price()
   ├─ GET /api/price-history
   │  └─ Calls: risk_engine.generate_mock_price_history()
   ├─ GET /api/risk-assessment
   │  └─ Calls: risk_engine.assess_overall_risk()
   ├─ POST /api/train-model
   │  └─ Calls: price_model.train_model()
   │
   ├─ price_model.py
   │  ├─ load_model() → Loads price_model.pkl
   │  ├─ predict_price(crop, district, arrival_quantity)
   │  │  └─ Uses RandomForestRegressor
   │  ├─ train_model()
   │  │  └─ Trains on mandi_prices.csv
   │  └─ generate_mock_price(crop)
   │
   └─ risk_engine.py
      ├─ calculate_oversupply_risk(current_area, last_year_area)
      ├─ calculate_market_volatility_risk(price_history)
      ├─ calculate_seasonal_demand_risk(crop, current_month)
      ├─ assess_overall_risk(...)
      ├─ generate_risk_factors(crop, district, price_trend)
      ├─ generate_recommendations(risk_level, crop)
      └─ generate_mock_price_history(months)
```

---

## 🎯 Command Reference

### Start Backend
```bash
cd backend
npm install          # First time only
npm start            # Runs on port 3001
# Wait for: "Server is running on port 3001"
```

### Start Python AI Service
```bash
cd ai-services

# Setup virtual environment (recommended, first time)
python -m venv venv
source venv/bin/activate        # Mac/Linux
# or
venv\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt

# Optional: Train model (if you have mandi_prices.csv)
python train_price_model.py

# Start API server
python -m uvicorn ai_price_api:app --reload --port 5000
# Wait for: "Uvicorn running on http://127.0.0.1:5000"
```

### Start Frontend
```bash
cd frontend
npm install          # First time only
npm run dev          # Runs on port 3002
# Opens http://localhost:3002
```

---

## 🧪 Test Endpoints

### Using curl

```bash
# Test 1: Price Prediction
curl "http://localhost:3001/api/ai/predict-price?crop=Wheat&district=Hisar&arrival_quantity=1000"

# Test 2: Price History
curl "http://localhost:3001/api/ai/price-history?crop=Rice&district=Jalandhar&months=12"

# Test 3: Risk Assessment
curl "http://localhost:3001/api/ai/risk-assessment?crop=Cotton&district=Nagpur"

# Test 4: Python Service Health
curl "http://localhost:5000/health"

# Test 5: Python Direct Call
curl "http://localhost:5000/api/predict-price?crop=Wheat&district=Hisar&arrival_quantity=1000"
```

### Using Postman

```
1. Create new request
2. Method: GET
3. URL: http://localhost:3001/api/ai/predict-price
4. Params:
   - crop: Wheat
   - district: Hisar
   - arrival_quantity: 1000
5. Send
```

### Using Browser

```
http://localhost:3001/api/ai/predict-price?crop=Wheat&district=Hisar&arrival_quantity=1000
http://localhost:3001/api/ai/price-history?crop=Wheat&district=Hisar&months=12
http://localhost:3001/api/ai/risk-assessment?crop=Wheat&district=Hisar
```

---

## 📊 Data Flow Example

### User Clicks "Price Prediction"

```
1. Modal Opens
   └─ Component: PricePredictionModal.tsx
      Form Fields:
      - Crop: [Wheat ▼]
      - District: [Hisar]
      - Quantity: [1000] kg

2. User Selects: Wheat, Hisar, 1000kg

3. User Clicks Submit
   └─ Frontend calls aiPriceService.getPricePrediction()
      └─ axios.get('http://localhost:3001/api/ai/predict-price?crop=Wheat&district=Hisar&arrival_quantity=1000')

4. Backend Receives Request
   └─ ai.routes.js routes to getPricePrediction controller
      └─ ai.controller.js validates input
         └─ Calls aiService.getPricePrediction(wheat, hisar, 1000)

5. Backend Service Calls Python
   └─ ai.service.js makes HTTP call
      └─ axios.get('http://localhost:5000/api/predict-price?crop=Wheat&district=Hisar&arrival_quantity=1000')

6. Python Service Predicts
   └─ ai_price_api.py receives request
      └─ Calls price_model.predict_price('Wheat', 'Hisar', 1000)
         └─ Uses RandomForest model
            └─ Returns: 2350 (₹)
      └─ Calls risk_engine.assess_overall_risk(...)
         └─ Returns: 'Medium' risk

7. Python Returns Response
   ```json
   {
     "predicted_price": 2350,
     "risk_level": "Medium",
     "confidence": 0.85,
     "historical_avg": 2115,
     "forecast_range": {"min": 1850, "max": 2850}
   }
   ```

8. Backend Returns to Frontend
   ```json
   {
     "success": true,
     "message": "Price prediction retrieved successfully",
     "data": {
       "predicted_price": 2350,
       "risk_level": "Medium",
       "confidence": 0.85,
       "historical_avg": 2115,
       "forecast_range": {"min": 1850, "max": 2850}
     }
   }
   ```

9. Frontend Displays Results
   └─ PricePredictionCard.tsx shows:
      - Predicted Price: ₹2350
      - Confidence: 85%
      - Historical Avg: ₹2115
      - Range: ₹1850-₹2850
   └─ RiskIndicator.tsx shows:
      - Risk Level: Medium
      - Risk Factors & Recommendations
   └─ PriceChart.tsx shows:
      - 12-month price history
```

---

## 🔄 Error & Fallback Flow

```
User Request
   ↓
Frontend calls Backend (/api/ai/predict-price)
   ↓
Backend tries to call Python Service
   │
   └─ [IF SUCCESS] ✅
      └─ Returns Python response
         └─ Frontend displays results
   │
   └─ [IF PYTHON SERVICE FAILS] ⚠️
      └─ Backend catches error
         └─ Uses _generateMockPrice(crop)
         └─ Returns mock data
            └─ Frontend displays results
               (Shows: "Mock data" note)
   │
   └─ [IF BACKEND FAILS] ⚠️
      └─ Frontend catches error
         └─ Uses frontend's aiPriceService mock
         └─ Displays mock results

Result: ✅ System always works, falls back gracefully
```

---

## 📈 Return Value Examples

### Price Prediction Response

```json
{
  "success": true,
  "message": "Price prediction retrieved successfully",
  "data": {
    "predicted_price": 2350,
    "risk_level": "Medium",
    "confidence": 0.85,
    "historical_avg": 2115,
    "forecast_range": {
      "min": 1850,
      "max": 2850
    }
  }
}
```

### Price History Response

```json
{
  "success": true,
  "message": "Price history retrieved successfully",
  "data": {
    "crop": "Wheat",
    "district": "Hisar",
    "months": 12,
    "price_history": [
      2400, 2350, 2300, 2250, 2200,
      2100, 2050, 2150, 2250, 2350,
      2450, 2500
    ],
    "average_price": 2258,
    "min_price": 2050,
    "max_price": 2500
  }
}
```

### Risk Assessment Response

```json
{
  "success": true,
  "message": "Risk assessment retrieved successfully",
  "data": {
    "crop": "Wheat",
    "district": "Hisar",
    "overall_risk": "Medium",
    "risk_score": 5,
    "risk_factors": [
      "Market Volatility: 22%",
      "Supply Variation: 18%",
      "Seasonal Demand: 12%"
    ],
    "recommendations": [
      "Monitor market trends daily",
      "Consider diversifying crops",
      "Plan storage and logistics"
    ]
  }
}
```

---

## 🌳 Directory Structure

```
kishan-unati-project/
│
├── frontend/
│   ├── app/
│   │   ├── dashboard/
│   │   │   └── page.tsx ✅ Modified to include modal
│   │   └── ...
│   ├── components/
│   │   ├── PricePredictionModal.tsx ✅ NEW
│   │   ├── PricePredictionCard.tsx ✅ NEW
│   │   ├── RiskIndicator.tsx ✅ NEW
│   │   ├── PriceChart.tsx ✅ NEW
│   │   └── ...
│   ├── lib/
│   │   ├── aiPriceService.ts ✅ NEW
│   │   └── ...
│   ├── styles/
│   │   ├── PricePrediction.module.css ✅ NEW
│   │   ├── PriceChart.module.css ✅ NEW
│   │   └── ...
│   ├── package.json ✅ Modified (added recharts)
│   └── ...
│
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   │   └── ai.routes.js ✅ Modified
│   │   │      (Added: /predict-price, /price-history, /risk-assessment)
│   │   ├── controllers/
│   │   │   └── ai.controller.js ✅ Modified
│   │   │      (Added: getPricePrediction, getPriceHistory, getRiskAssessment)
│   │   ├── services/
│   │   │   └── ai.service.js ✅ Modified
│   │   │      (Added: 6 methods + 4 helpers)
│   │   └── ...
│   ├── package.json
│   └── ...
│
├── ai-services/
│   ├── ai_price_api.py ✅ NEW (FastAPI server)
│   ├── train_price_model.py ✅ NEW (Training script)
│   ├── requirements.txt (All dependencies present)
│   ├── crop_recommendation/
│   │   ├── price_model.py ✅ NEW (ML model)
│   │   ├── risk_engine.py ✅ NEW (Risk assessment)
│   │   └── data/
│   │       └── mandi_prices.csv (Optional, for training)
│   └── ...
│
├── BACKEND_COMPLETE_SETUP.md ✅ NEW
├── BACKEND_IMPLEMENTATION_DETAILS.md ✅ NEW
├── QUICK_START_TEST.md ✅ NEW
├── FILE_REFERENCE_COMPLETE.md ✅ NEW
├── DELIVERY_SUMMARY.md ✅ NEW
└── ARCHITECTURE_REFERENCE.md (THIS FILE) ✅ NEW
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

### Python (.env)
```
API_PORT=5000
MODEL_PATH=crop_recommendation/price_model.pkl
```

---

## 🚀 Quick Reference Card

| Task | Command | Port |
|------|---------|------|
| Start Backend | `cd backend && npm start` | 3001 |
| Start Python | `cd ai-services && python -m uvicorn ai_price_api:app --reload --port 5000` | 5000 |
| Start Frontend | `cd frontend && npm run dev` | 3002 |
| Test Price | `curl "http://localhost:3001/api/ai/predict-price?crop=Wheat&district=Hisar"` | 3001 |
| Test History | `curl "http://localhost:3001/api/ai/price-history?crop=Wheat&district=Hisar&months=12"` | 3001 |
| Test Risk | `curl "http://localhost:3001/api/ai/risk-assessment?crop=Wheat&district=Hisar"` | 3001 |
| Python Health | `curl "http://localhost:5000/health"` | 5000 |
| Train Model | `python train_price_model.py` | - |

---

## 📚 Documentation Map

```
You are here ↓
ARCHITECTURE_REFERENCE.md (Technical deep-dive)
│
├─ QUICK_START_TEST.md (Get running fast)
│
├─ BACKEND_COMPLETE_SETUP.md (Detailed setup)
│
├─ BACKEND_IMPLEMENTATION_DETAILS.md (Code walkthrough)
│
├─ FILE_REFERENCE_COMPLETE.md (All files)
│
└─ DELIVERY_SUMMARY.md (Executive summary)
```

---

**Happy predicting! 🌾💰**

