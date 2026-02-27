"""
Price prediction ML model for Kisan Unnati
Uses RandomForestRegressor for crop price prediction
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
import joblib
import os
import logging

logger = logging.getLogger(__name__)

MODEL_PATH = "crop_recommendation/price_model.pkl"
CROPS_ENCODER_PATH = "crop_recommendation/crops_encoder.pkl"
DISTRICTS_ENCODER_PATH = "crop_recommendation/districts_encoder.pkl"

# Global encoders
crop_encoder = None
district_encoder = None
model = None

def load_model():
    """Load pre-trained model and encoders"""
    global crop_encoder, district_encoder, model
    
    try:
        if os.path.exists(MODEL_PATH):
            model, crop_encoder, district_encoder = joblib.load(MODEL_PATH)
            logger.info(f"Model loaded successfully from {MODEL_PATH}")
        else:
            logger.warning(f"Model file not found at {MODEL_PATH}. Using mock predictions.")
            model = None
            crop_encoder = None
            district_encoder = None
    except Exception as e:
        logger.error(f"Error loading model: {str(e)}")
        model = None
        crop_encoder = None
        district_encoder = None

def train_model():
    """
    Train the price prediction model.
    This function should be called after setting up the mandi_prices.csv file
    """
    try:
        # Check if CSV exists
        csv_path = "crop_recommendation/data/mandi_prices.csv"
        if not os.path.exists(csv_path):
            logger.warning(f"Training data not found at {csv_path}. Please add mandi_prices.csv")
            return "Training data not found. Please add mandi_prices.csv with columns: date, crop, district, modal_price, arrival_quantity"
        
        # Load data
        df = pd.read_csv(csv_path)
        logger.info(f"Loaded {len(df)} records for training")
        
        # Data preprocessing
        df.dropna(inplace=True)
        
        # Extract month from date
        df['date'] = pd.to_datetime(df['date'])
        df['month'] = df['date'].dt.month
        df['year'] = df['date'].dt.year
        
        # Encode categorical variables
        crop_encoder = LabelEncoder()
        district_encoder = LabelEncoder()
        
        df['crop_encoded'] = crop_encoder.fit_transform(df['crop'])
        df['district_encoded'] = district_encoder.fit_transform(df['district'])
        
        # Prepare features and target
        X = df[['crop_encoded', 'district_encoded', 'month', 'arrival_quantity']]
        y = df['modal_price']
        
        # Train model
        model = RandomForestRegressor(
            n_estimators=100,
            random_state=42,
            n_jobs=-1,
            max_depth=15
        )
        model.fit(X, y)
        
        logger.info("Model trained successfully")
        
        # Save model and encoders
        os.makedirs("crop_recommendation", exist_ok=True)
        joblib.dump((model, crop_encoder, district_encoder), MODEL_PATH)
        logger.info(f"Model saved to {MODEL_PATH}")
        
        return "Model trained and saved successfully"
        
    except Exception as e:
        logger.error(f"Error training model: {str(e)}")
        return f"Error training model: {str(e)}"

def predict_price(crop, district, arrival_quantity=1000):
    """
    Predict crop price
    
    Parameters:
    - crop: Crop name (str)
    - district: District name (str)
    - arrival_quantity: Quantity arriving in market (int)
    
    Returns:
    - Predicted price (float)
    """
    global crop_encoder, district_encoder, model
    
    # Load model if not already loaded
    if model is None:
        load_model()
    
    # If model couldn't be loaded, return mock prediction
    if model is None:
        return generate_mock_price(crop)
    
    try:
        # Get current month
        current_month = pd.Timestamp.now().month
        
        # Encode input
        crop_encoded = crop_encoder.transform([crop.lower()])[0] if crop.lower() in crop_encoder.classes_ else 0
        district_encoded = district_encoder.transform([district.lower()])[0] if district.lower() in district_encoder.classes_ else 0
        
        # Prepare features [crop_encoded, district_encoded, month, arrival_quantity]
        features = np.array([[crop_encoded, district_encoded, current_month, arrival_quantity]])
        
        # Predict
        predicted_price = model.predict(features)[0]
        
        # Ensure reasonable price range
        if predicted_price < 100:
            predicted_price = generate_mock_price(crop) 
        elif predicted_price > 10000:
            predicted_price = 8000
        
        logger.info(f"Predicted price for {crop} in {district}: {predicted_price:.2f} INR/kg")
        return predicted_price
        
    except Exception as e:
        logger.error(f"Error predicting price: {str(e)}")
        return generate_mock_price(crop)

def generate_mock_price(crop):
    """Generate mock price for testing"""
    base_prices = {
        'wheat': 2400,
        'rice': 2200,
        'corn': 1800,
        'cotton': 5500,
        'sugarcane': 3200,
        'pulses': 4500,
        'oilseeds': 4200,
        'potato': 1200,
        'tomato': 1500,
        'onion': 1800,
        'garlic': 5000,
        'turmeric': 6500
    }
    
    crop_lower = crop.lower()
    base_price = base_prices.get(crop_lower, 2500)
    
    # Add some randomness (±10%)
    variation = base_price * (0.9 + np.random.random() * 0.2)
    return float(variation)

# Load model on import
load_model()
