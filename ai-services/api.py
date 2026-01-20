from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import uvicorn
import os
from dotenv import load_dotenv

# Import AI service modules
from crop_recommendation.predict import CropRecommender
from disease_detection.predict import DiseaseDetector
from chatbot.intent_handler import ChatbotHandler

# Load environment variables
load_dotenv()

app = FastAPI(
    title="Kisan Unnati AI Services",
    description="AI-powered agricultural services for farmers",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],  # Frontend and backend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI services
crop_recommender = CropRecommender()
disease_detector = DiseaseDetector()
chatbot_handler = ChatbotHandler()

# Pydantic models for request/response
class CropRecommendationRequest(BaseModel):
    soil_type: str
    location: str
    season: str
    temperature: Optional[float] = None
    rainfall: Optional[float] = None
    ph_level: Optional[float] = None

class CropRecommendationResponse(BaseModel):
    recommended_crops: List[Dict[str, Any]]
    confidence_scores: Dict[str, float]
    reasoning: str

class ChatRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None
    user_id: Optional[str] = None

class ChatResponse(BaseModel):
    response: str
    intent: str
    confidence: float
    suggested_actions: Optional[List[str]] = None

class DiseaseDetectionResponse(BaseModel):
    disease: str
    confidence: float
    treatment: str
    prevention: str
    severity: str

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "Kisan Unnati AI Services API",
        "status": "running",
        "version": "1.0.0"
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "services": {
            "crop_recommendation": crop_recommender.is_ready(),
            "disease_detection": disease_detector.is_ready(),
            "chatbot": chatbot_handler.is_ready()
        }
    }

@app.post("/crop-recommendation", response_model=CropRecommendationResponse)
async def recommend_crops(request: CropRecommendationRequest):
    """Get crop recommendations based on soil, location, and weather conditions"""
    try:
        recommendations = crop_recommender.predict(
            soil_type=request.soil_type,
            location=request.location,
            season=request.season,
            temperature=request.temperature,
            rainfall=request.rainfall,
            ph_level=request.ph_level
        )

        return CropRecommendationResponse(**recommendations)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Crop recommendation failed: {str(e)}")

@app.post("/disease-detection", response_model=DiseaseDetectionResponse)
async def detect_disease(
    file: UploadFile = File(...),
    crop_type: str = Form(...)
):
    """Detect crop diseases from uploaded images"""
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")

        # Read image data
        image_data = await file.read()

        # Detect disease
        result = disease_detector.predict(image_data, crop_type)

        return DiseaseDetectionResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Disease detection failed: {str(e)}")

@app.post("/chat", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequest):
    """AI-powered agricultural chatbot"""
    try:
        response = chatbot_handler.process_message(
            message=request.message,
            context=request.context,
            user_id=request.user_id
        )

        return ChatResponse(**response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat processing failed: {str(e)}")

@app.post("/analyze-soil")
async def analyze_soil(
    nitrogen: float = Form(...),
    phosphorus: float = Form(...),
    potassium: float = Form(...),
    ph_level: float = Form(...),
    organic_matter: Optional[float] = Form(None)
):
    """Analyze soil health and provide recommendations"""
    try:
        analysis = crop_recommender.analyze_soil({
            'nitrogen': nitrogen,
            'phosphorus': phosphorus,
            'potassium': potassium,
            'ph_level': ph_level,
            'organic_matter': organic_matter
        })

        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Soil analysis failed: {str(e)}")

@app.get("/market-insights")
async def get_market_insights(crop_type: Optional[str] = None, location: Optional[str] = None):
    """Get market price predictions and insights"""
    try:
        insights = crop_recommender.get_market_insights(crop_type, location)
        return insights
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Market insights failed: {str(e)}")

@app.post("/weather-advice")
async def get_weather_advice(
    temperature: float = Form(...),
    humidity: float = Form(...),
    rainfall: float = Form(...),
    wind_speed: float = Form(...),
    crop_stage: str = Form(...)
):
    """Get weather-based farming advice"""
    try:
        advice = crop_recommender.get_weather_advice({
            'temperature': temperature,
            'humidity': humidity,
            'rainfall': rainfall,
            'wind_speed': wind_speed,
            'crop_stage': crop_stage
        })

        return advice
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Weather advice failed: {str(e)}")

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "api:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )