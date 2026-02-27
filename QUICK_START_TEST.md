# 🚀 QUICK START - Test Price Prediction in 3 Minutes

## ⚡ Fastest Way to Test

### Option 1: Frontend Only (No backend needed) ⚡ FASTEST
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3002
# Click "Price Prediction" button
# Works immediately with mock data! ✅
```

---

## Option 2: Complete Stack (All 3 services)

### Terminal 1: Start Backend
```bash
cd backend
npm install
npm start
# Wait for: "Server is running on port 3001"
```

### Terminal 2: Start Python AI Service
```bash
cd ai-services

# Windows Users:
python -m venv venv
venv\Scripts\activate

# Mac/Linux Users:
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start AI service
python -m uvicorn ai_price_api:app --reload --port 5000
# Wait for: "Uvicorn running on http://127.0.0.1:5000"
```

### Terminal 3: Start Frontend
```bash
cd frontend
npm install
npm run dev
# Open http://localhost:3002
```

### ✅ All 3 running? Test it!
1. Go to http://localhost:3002
2. Click "Dashboard" 
3. Look for "Price Prediction" button
4. Click it
5. See the results! 🎉

---

## 🧪 Test Each Endpoint Individually

### Test Backend Endpoint (requires backend running)
```bash
# Test price prediction
curl "http://localhost:3001/api/ai/predict-price?crop=Wheat&district=Hisar&arrival_quantity=1000"

# Test price history
curl "http://localhost:3001/api/ai/price-history?crop=Wheat&district=Hisar&months=12"

# Test risk assessment
curl "http://localhost:3001/api/ai/risk-assessment?crop=Wheat&district=Hisar"
```

### Test Python Service Directly (requires AI service running)
```bash
# Test health
curl "http://localhost:5000/health"

# Test price prediction
curl "http://localhost:5000/api/predict-price?crop=Wheat&district=Hisar&arrival_quantity=1000"

# Test price history
curl "http://localhost:5000/api/price-history?crop=Wheat&district=Hisar&months=12"

# Test risk assessment
curl "http://localhost:5000/api/risk-assessment?crop=Wheat&district=Hisar"
```

---

## 📋 Expected Response Examples

### Successful Price Prediction
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

### Successful Price History
```json
{
  "success": true,
  "message": "Price history retrieved successfully",
  "data": {
    "crop": "Wheat",
    "district": "Hisar",
    "months": 12,
    "price_history": [2400, 2350, 2300, 2250, 2200, 2100, 2050, 2150, 2250, 2350, 2450, 2500],
    "average_price": 2258,
    "min_price": 2050,
    "max_price": 2500
  }
}
```

### Successful Risk Assessment
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

## 🐛 Troubleshooting

### "Cannot find module" error
```bash
# In the directory where error occurred
npm install
# or
pip install -r requirements.txt
```

### "Port already in use" error
```bash
# Change port
npm run dev -- -p 3003
# or in Python
python -m uvicorn ai_price_api:app --reload --port 5001
```

### "Connection refused" to AI service
```
✅ This is fine! Backend automatically uses mock data
✅ Frontend will still work
✅ Just need backend running minimum
```

### "ModuleNotFoundError: No module named 'fastapi'"
```bash
cd ai-services
pip install fastapi uvicorn
```

---

## 📁 What Each Component Does

**Frontend (React)**
```
Shows UI for price prediction
Calls http://localhost:3001/api/ai/... 
Automatically fallback to mock data if unavailable
```

**Backend (Node.js)**
```
Receives requests from frontend
Calls Python AI service
Returns predictions with error handling
Fallback to mock data if Python service down
```

**Python AI Service**
```
Actual ML model for predictions
Calculates risk factors
Returns price forecasts
Can train on real data
```

---

## ⚙️ Environment Setup (Optional)

### If you want to use real data

1. Get `mandi_prices.csv` data with columns:
   - date (YYYY-MM-DD format)
   - crop (wheat, rice, corn, etc.)
   - district (location)
   - modal_price (₹)
   - arrival_quantity (kg)

2. Place in: `ai-services/crop_recommendation/data/mandi_prices.csv`

3. Train the model:
```bash
cd ai-services
python train_price_model.py
```

4. Restart Python service:
```bash
python -m uvicorn ai_price_api:app --reload --port 5000
```

---

## ✅ Verification Checklist

After starting everything:

- [ ] Frontend loads at http://localhost:3002
- [ ] Can see dashboard with "Price Prediction" button
- [ ] Backend running on http://localhost:3001
- [ ] Can see Backend logs showing price requests
- [ ] Python service running on http://localhost:5000
- [ ] `/health` endpoint returns `{"status": "ok"}`
- [ ] Click "Price Prediction" in frontend
- [ ] See predictions with actual/mock data ✅

---

## 📊 Files You Need to Know About

| Component | File | Status |
|-----------|------|--------|
| Frontend Routes | `frontend/app/dashboard/page.tsx` | ✅ Updated |
| Frontend Component | `frontend/components/PricePredictionModal.tsx` | ✅ Created |
| Frontend Service | `frontend/lib/aiPriceService.ts` | ✅ Created |
| Backend Routes | `backend/src/routes/ai.routes.js` | ✅ Updated |
| Backend Controller | `backend/src/controllers/ai.controller.js` | ✅ Updated |
| Backend Service | `backend/src/services/ai.service.js` | ✅ Updated |
| Python API | `ai-services/ai_price_api.py` | ✅ Created |
| ML Model | `ai-services/crop_recommendation/price_model.py` | ✅ Created |
| Risk Engine | `ai-services/crop_recommendation/risk_engine.py` | ✅ Created |

---

## 🎯 What Happens When You Click "Price Prediction"

```
1. Frontend shows modal with crop/district inputs
2. User enters: Wheat, Hisar, 1000kg
3. Frontend calls: GET /api/ai/predict-price?crop=Wheat&district=Hisar&arrival_quantity=1000
4. Backend receives request
5. Backend calls: GET http://localhost:5000/api/predict-price?...
6. Python service predicts using ML model (or mock if error)
7. Backend returns response to frontend
8. Frontend shows:
   - Predicted Price: ₹2350
   - Risk Level: Medium
   - Confidence: 85%
   - Historical Average: ₹2115
   - Price Range: ₹1850 - ₹2850
```

---

## 🎉 Done!

**Your complete Price Prediction feature is ready to use!**

### Next Steps:
1. **Test it** - Follow Option 1 or 2 above
2. **Train with real data** - Add mandi_prices.csv and run training
3. **Deploy** - When ready for production

---

## 💡 Pro Tips

- Frontend works alone without backend (uses mock data)
- Backend works without Python service (fallback to mock)
- Python service is optional for development
- All three services can run independently
- Use environment variables to customize ports/URLs

---

**Questions?** Check these files:
- Setup: `BACKEND_COMPLETE_SETUP.md`
- Details: `BACKEND_IMPLEMENTATION_DETAILS.md`
- Architecture: `PRICE_PREDICTION_ARCHITECTURE.md`

