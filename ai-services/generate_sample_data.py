"""
Sample Data Generator for Testing
Generates synthetic data for all three models
"""

import pandas as pd
import numpy as np
import os
import json
from PIL import Image

def generate_crop_data():
    """Generate sample crop recommendation data"""
    print("🌾 Generating sample crop data...")
    
    crops = ['rice', 'wheat', 'maize', 'cotton', 'sugarcane', 'potato', 
             'tomato', 'onion', 'banana', 'mango']
    
    data = []
    for crop in crops:
        for _ in range(200):
            if crop == 'rice':
                row = {
                    'N': np.random.uniform(80, 100),
                    'P': np.random.uniform(40, 60),
                    'K': np.random.uniform(40, 50),
                    'temperature': np.random.uniform(20, 27),
                    'humidity': np.random.uniform(80, 90),
                    'ph': np.random.uniform(6, 7),
                    'rainfall': np.random.uniform(200, 300),
                    'label': crop
                }
            elif crop == 'wheat':
                row = {
                    'N': np.random.uniform(70, 90),
                    'P': np.random.uniform(50, 70),
                    'K': np.random.uniform(35, 45),
                    'temperature': np.random.uniform(18, 25),
                    'humidity': np.random.uniform(70, 85),
                    'ph': np.random.uniform(6.5, 7.5),
                    'rainfall': np.random.uniform(150, 250),
                    'label': crop
                }
            else:
                row = {
                    'N': np.random.uniform(50, 120),
                    'P': np.random.uniform(30, 80),
                    'K': np.random.uniform(30, 60),
                    'temperature': np.random.uniform(15, 35),
                    'humidity': np.random.uniform(60, 95),
                    'ph': np.random.uniform(5.5, 8),
                    'rainfall': np.random.uniform(100, 300),
                    'label': crop
                }
            data.append(row)
    
    df = pd.DataFrame(data)
    
    # Create directory
    os.makedirs('crop_recommendation/data', exist_ok=True)
    
    # Save CSV
    df.to_csv('crop_recommendation/data/crop_data.csv', index=False)
    print(f"✅ Generated {len(df)} crop samples")
    print(f"   Saved to: crop_recommendation/data/crop_data.csv")

def generate_disease_images():
    """Generate dummy disease images"""
    print("🔬 Generating sample disease images...")
    
    diseases = ['healthy', 'bacterial_blight', 'leaf_blight', 'powdery_mildew']
    
    for split in ['train', 'validation']:
        for disease in diseases:
            path = f'disease_detection/data/{split}/{disease}'
            os.makedirs(path, exist_ok=True)
            
            # Generate random images
            num_images = 100 if split == 'train' else 20
            for i in range(num_images):
                # Create random RGB image
                img = np.random.randint(0, 255, (224, 224, 3), dtype=np.uint8)
                img = Image.fromarray(img)
                img.save(f'{path}/sample_{i}.jpg')
    
    print(f"✅ Generated sample disease images")
    print(f"   Training: {len(diseases) * 100} images")
    print(f"   Validation: {len(diseases) * 20} images")

def generate_chatbot_intents():
    """Generate sample chatbot intents"""
    print("🤖 Generating sample chatbot intents...")
    
    intents = {
        "intents": [
            {
                "tag": "greeting",
                "patterns": [
                    "hello", "hi", "hey", "good morning", "good evening",
                    "namaste", "hi there", "hello there", "greetings"
                ],
                "responses": [
                    "Hello! How can I help you with farming today?",
                    "Hi there! I'm here to assist you with agricultural queries.",
                    "Namaste! What can I help you with?"
                ]
            },
            {
                "tag": "crop_info",
                "patterns": [
                    "tell me about wheat", "wheat information", "how to grow wheat",
                    "wheat farming", "what is wheat", "wheat cultivation"
                ],
                "responses": [
                    "Wheat is a cereal crop grown in cooler climates. It requires well-drained loamy soil.",
                    "Wheat farming requires proper irrigation and fertilization. Best sowing time is November."
                ]
            },
            {
                "tag": "fertilizer",
                "patterns": [
                    "which fertilizer to use", "fertilizer for rice", "NPK ratio",
                    "fertilizer recommendation", "best fertilizer", "organic fertilizer"
                ],
                "responses": [
                    "For rice, use NPK ratio of 4:2:1. Apply 120 kg N, 60 kg P2O5, and 40 kg K2O per hectare.",
                    "Choose fertilizers based on soil test results for best results."
                ]
            },
            {
                "tag": "disease",
                "patterns": [
                    "plant disease", "leaf spots", "yellow leaves", "disease symptoms",
                    "pest control", "fungal infection", "bacterial disease"
                ],
                "responses": [
                    "Please upload a photo of the affected plant for disease detection.",
                    "Common symptoms include yellow leaves, spots, wilting. I can analyze images for accurate diagnosis."
                ]
            },
            {
                "tag": "weather",
                "patterns": [
                    "weather", "rainfall", "temperature", "climate",
                    "monsoon", "when to sow", "best season"
                ],
                "responses": [
                    "Weather plays a crucial role in farming. Check local forecasts before sowing.",
                    "Different crops require different climate conditions. What crop are you planning?"
                ]
            },
            {
                "tag": "schemes",
                "patterns": [
                    "government schemes", "PM-KISAN", "subsidy", "loan",
                    "farmer benefits", "agricultural schemes", "government support"
                ],
                "responses": [
                    "Several government schemes are available like PM-KISAN, Soil Health Card, etc.",
                    "You can check the schemes section in our app for detailed information."
                ]
            },
            {
                "tag": "goodbye",
                "patterns": [
                    "bye", "goodbye", "see you", "talk later", "thanks bye",
                    "thank you goodbye"
                ],
                "responses": [
                    "Goodbye! Happy farming!",
                    "See you later! Feel free to ask anytime.",
                    "Thank you for using Kisan Unnati. Have a great day!"
                ]
            }
        ]
    }
    
    # Create directory
    os.makedirs('chatbot/data', exist_ok=True)
    
    # Save JSON
    with open('chatbot/data/intents.json', 'w', encoding='utf-8') as f:
        json.dump(intents, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Generated {len(intents['intents'])} intent categories")
    print(f"   Saved to: chatbot/data/intents.json")

def main():
    """Generate all sample data"""
    print("="*60)
    print("📦 SAMPLE DATA GENERATOR")
    print("="*60)
    print("\nThis will generate synthetic data for testing.")
    print("For production, replace with real data!\n")
    
    generate_crop_data()
    print()
    generate_disease_images()
    print()
    generate_chatbot_intents()
    
    print("\n" + "="*60)
    print("✅ Sample data generated successfully!")
    print("="*60)
    print("\nNext steps:")
    print("1. Review generated data")
    print("2. Replace with real data for production")
    print("3. Run: python train_all_models.py")

if __name__ == "__main__":
    main()
