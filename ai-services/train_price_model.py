"""
Train script for the price prediction model
Run this script to train the model with mandi_prices.csv data
"""

if __name__ == "__main__":
    from crop_recommendation.price_model import train_model
    
    print("🌾 Kisan Unnati - Price Prediction Model Training")
    print("=" * 50)
    
    result = train_model()
    print(result)
    
    print("\n✅ Training completed!")
    print("\nNext steps:")
    print("1. Start the API server:")
    print("   python -m uvicorn ai_price_api:app --reload --port 5000")
    print("\n2. Test the API:")
    print("   curl http://localhost:5000/api/predict-price?crop=Wheat&district=Hisar")
