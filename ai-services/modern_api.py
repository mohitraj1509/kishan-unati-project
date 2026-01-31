"""
Modern AI Services API
FastAPI with ML Model Serving
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import numpy as np
import joblib
import tensorflow as tf
import pickle
import json
import os
from typing import Optional, List, Dict
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Kisan Unnati AI Services",
    description="Modern AI Services for Agriculture",
    version="2.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Models storage
models = {
    'crop': None,
    'disease': None,
    'chatbot': None
}

# Request Models
class CropRecommendationRequest(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float

class ChatbotRequest(BaseModel):
    message: str
    user_id: Optional[str] = "anonymous"

# Startup event - Load models
@app.on_event("startup")
async def load_models():
    """Load all ML models on startup"""
    logger.info("🚀 Loading AI models...")
    
    try:
        # Load crop model
        crop_path = 'crop_recommendation/models/crop_model.pkl'
        if os.path.exists(crop_path):
            models['crop'] = joblib.load(crop_path)
            logger.info("✅ Crop recommendation model loaded")
        else:
            logger.warning("⚠️ Crop model not found")
        
        # Load disease detection model
        disease_path = 'disease_detection/models/disease_model.h5'
        if os.path.exists(disease_path):
            models['disease'] = tf.keras.models.load_model(disease_path)
            # Load class indices
            with open('disease_detection/models/class_indices.json', 'r') as f:
                models['disease_classes'] = json.load(f)
            logger.info("✅ Disease detection model loaded")
        else:
            logger.warning("⚠️ Disease model not found")
        
        # Load chatbot model
        chatbot_path = 'chatbot/models/chatbot_model.h5'
        if os.path.exists(chatbot_path):
            models['chatbot'] = tf.keras.models.load_model(chatbot_path)
            with open('chatbot/models/tokenizer.pkl', 'rb') as f:
                models['tokenizer'] = pickle.load(f)
            with open('chatbot/models/label_encoder.pkl', 'rb') as f:
                models['label_encoder'] = pickle.load(f)
            with open('chatbot/models/intents.json', 'r', encoding='utf-8') as f:
                models['intents'] = json.load(f)
            logger.info("✅ Chatbot model loaded")
        else:
            logger.warning("⚠️ Chatbot model not found")
        
        logger.info("🎉 All models loaded successfully!")
        
    except Exception as e:
        logger.error(f"❌ Error loading models: {e}")

@app.get("/")
async def root():
    """API health check"""
    return {
        "status": "active",
        "message": "Kisan Unnati AI Services API v2.0",
        "models_loaded": {
            "crop_recommendation": models['crop'] is not None,
            "disease_detection": models['disease'] is not None,
            "chatbot": models['chatbot'] is not None
        }
    }

@app.get("/health")
async def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "models": {
            "crop": "loaded" if models['crop'] else "not_loaded",
            "disease": "loaded" if models['disease'] else "not_loaded",
            "chatbot": "loaded" if models['chatbot'] else "not_loaded"
        }
    }

@app.post("/api/crop/recommend")
async def recommend_crop(request: CropRecommendationRequest):
    """Recommend crop based on soil and weather conditions"""
    try:
        if models['crop'] is None:
            raise HTTPException(status_code=503, detail="Crop model not loaded")
        
        model_data = models['crop']
        
        # Prepare input
        input_features = np.array([[
            request.N, request.P, request.K,
            request.temperature, request.humidity,
            request.ph, request.rainfall
        ]])
        
        # Add engineered features
        npk_ratio = request.N / (request.P + request.K + 1)
        temp_humidity = request.temperature * request.humidity / 100
        soil_fertility = (request.N + request.P + request.K) / 3
        
        input_features = np.append(input_features, [[npk_ratio, temp_humidity, soil_fertility]], axis=1)
        
        # Scale features
        input_scaled = model_data['scaler'].transform(input_features)
        
        # Predict
        prediction = model_data['model'].predict(input_scaled)
        probabilities = model_data['model'].predict_proba(input_scaled)[0]
        
        # Get top 3 recommendations
        top_indices = np.argsort(probabilities)[-3:][::-1]
        recommendations = []
        
        for idx in top_indices:
            crop = model_data['label_encoder'].inverse_transform([idx])[0]
            confidence = float(probabilities[idx])
            recommendations.append({
                "crop": crop,
                "confidence": confidence
            })
        
        return {
            "success": True,
            "recommended_crop": recommendations[0]['crop'],
            "confidence": recommendations[0]['confidence'],
            "alternatives": recommendations[1:],
            "input": request.dict()
        }
        
    except Exception as e:
        logger.error(f"Error in crop recommendation: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/disease/detect")
async def detect_disease(file: UploadFile = File(...)):
    """Detect plant disease from image"""
    try:
        if models['disease'] is None:
            raise HTTPException(status_code=503, detail="Disease model not loaded")
        
        # Read and preprocess image
        contents = await file.read()
        nparr = np.frombuffer(contents, np.uint8)
        import cv2
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
        img = cv2.resize(img, (224, 224))
        img = img.astype(np.float32) / 255.0
        img = np.expand_dims(img, axis=0)
        
        # Predict
        predictions = models['disease'].predict(img)[0]
        
        # Get top 3 predictions
        top_indices = np.argsort(predictions)[-3:][::-1]
        results = []
        
        for idx in top_indices:
            disease = models['disease_classes'][str(idx)]
            confidence = float(predictions[idx])
            results.append({
                "disease": disease,
                "confidence": confidence
            })
        
        return {
            "success": True,
            "detected_disease": results[0]['disease'],
            "confidence": results[0]['confidence'],
            "alternatives": results[1:]
        }
        
    except Exception as e:
        logger.error(f"Error in disease detection: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/chatbot/message")
async def chatbot_message(request: ChatbotRequest):
    """Process chatbot message"""
    try:
        if models['chatbot'] is None:
            raise HTTPException(status_code=503, detail="Chatbot model not loaded")
        
        # Tokenize and pad
        sequence = models['tokenizer'].texts_to_sequences([request.message.lower()])
        
        # Get max length from metadata
        with open('chatbot/models/model_metadata.json', 'r') as f:
            metadata = json.load(f)
        max_length = metadata['max_length']
        
        from tensorflow.keras.preprocessing.sequence import pad_sequences
        padded = pad_sequences(sequence, maxlen=max_length, padding='post')
        
        # Predict intent
        prediction = models['chatbot'].predict(padded, verbose=0)
        intent_idx = np.argmax(prediction[0])
        confidence = float(prediction[0][intent_idx])
        
        # Get intent tag
        intent_tag = models['label_encoder'].inverse_transform([intent_idx])[0]
        
        # Get response
        for intent in models['intents']['intents']:
            if intent['tag'] == intent_tag:
                import random
                response = random.choice(intent['responses'])
                break
        else:
            response = "I'm sorry, I didn't understand that."
        
        return {
            "success": True,
            "message": request.message,
            "response": response,
            "intent": intent_tag,
            "confidence": confidence
        }
        
    except Exception as e:
        logger.error(f"Error in chatbot: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(
        "modern_api:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
