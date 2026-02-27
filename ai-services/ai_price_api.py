from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import joblib
import datetime
import os
import logging
from crop_recommendation.risk_engine import calculate_oversupply_risk, generate_mock_price_history
from crop_recommendation.price_model import predict_price

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Kisan Unnati - Price Prediction API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MODEL_PATH = "crop_recommendation/price_model.pkl"

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "OK",
        "service": "Kisan Unnati Price Prediction API",
        "timestamp": datetime.datetime.now().isoformat()
    }

@app.get("/api/predict-price")
async def get_price_prediction(crop: str, district: str, arrival_quantity: int = 1000):
    """
    Predict crop price based on crop type, district, and arrival quantity
    
    Parameters:
    - crop: Crop name (e.g., Wheat, Rice, Corn)
    - district: District name
    - arrival_quantity: Quantity arriving in market (default: 1000)
    
    Returns:
    - predicted_price: Predicted price in INR
    - risk_level: Market risk (High/Medium/Low)
    - confidence: Confidence level (0-1)
    - historical_avg: Historical average price
    - forecast_range: Min and Max price forecast
    """
    try:
        if not crop or not district:
            raise HTTPException(status_code=400, detail="Crop and district parameters are required")
        
        # Predict price
        predicted_price = predict_price(crop, district, arrival_quantity)
        
        # Calculate risk
        risk_level = calculate_oversupply_risk(12000, 10000)
        
        # Generate response
        return {
            "predicted_price": float(predicted_price),
            "risk_level": risk_level,
            "confidence": 0.85,
            "historical_avg": float(predicted_price * 0.9),
            "forecast_range": {
                "min": float(predicted_price - 500),
                "max": float(predicted_price + 500)
            },
            "crop": crop,
            "district": district,
            "timestamp": datetime.datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error predicting price: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to predict price")

@app.get("/api/price-history")
async def get_price_history(crop: str, district: str, months: int = 12):
    """
    Get historical price data for a crop in a district
    
    Parameters:
    - crop: Crop name
    - district: District name
    - months: Number of months to retrieve (default: 12)
    
    Returns:
    - List of {month, price} objects
    """
    try:
        if not crop or not district:
            raise HTTPException(status_code=400, detail="Crop and district parameters are required")
        
        # Generate mock price history
        history = generate_mock_price_history(months)
        
        return {
            "crop": crop,
            "district": district,
            "months": months,
            "history": history,
            "timestamp": datetime.datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error retrieving price history: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to retrieve price history")

@app.get("/api/risk-assessment")
async def get_risk_assessment(crop: str, district: str):
    """
    Get risk assessment for a crop in a district
    
    Parameters:
    - crop: Crop name
    - district: District name
    
    Returns:
    - risk_level: Overall risk level
    - factors: List of risk factors with percentages
    """
    try:
        if not crop or not district:
            raise HTTPException(status_code=400, detail="Crop and district parameters are required")
        
        risk_level = calculate_oversupply_risk(12000, 10000)
        
        return {
            "crop": crop,
            "district": district,
            "risk_level": risk_level,
            "factors": [
                "Market volatility: 25%",
                "Supply variation: 18%",
                "Seasonal demand: 12%",
                "Weather impact: 20%"
            ],
            "recommendations": [
                "Monitor market trends",
                "Plan harvest timing",
                "Consider storage options"
            ],
            "timestamp": datetime.datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error assessing risk: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to assess risk")

@app.post("/api/train-model")
async def train_model():
    """
    Endpoint to trigger model training (admin only in production)
    """
    try:
        from crop_recommendation.price_model import train_model
        message = train_model()
        return {
            "status": "success",
            "message": message,
            "timestamp": datetime.datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"Error training model: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to train model")

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("API_PORT", 5000))
    uvicorn.run(app, host="0.0.0.0", port=port)
