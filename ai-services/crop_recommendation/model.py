import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib
import os
from typing import Dict, List, Any, Optional
import json

class CropRecommendationModel:
    def __init__(self, model_path: str = "crop_recommendation/models/crop_model.pkl"):
        self.model_path = model_path
        self.model = None
        self.label_encoder = None
        self.scaler = None
        self.feature_columns = [
            'N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'
        ]
        self.crop_data = None
        self._load_data()

    def _load_data(self):
        """Load crop dataset"""
        try:
            # Load crop recommendation dataset
            data_path = os.path.join(os.path.dirname(__file__), "data", "crop_data.csv")
            if os.path.exists(data_path):
                self.crop_data = pd.read_csv(data_path)
            else:
                # Create sample dataset if file doesn't exist
                self._create_sample_data()
        except Exception as e:
            print(f"Error loading crop data: {e}")
            self._create_sample_data()

    def _create_sample_data(self):
        """Create sample crop dataset for demonstration"""
        data = {
            'N': [90, 85, 60, 74, 78, 69, 62, 54, 67, 7, 17, 20, 100, 118, 60, 25, 22, 30, 40, 100, 99, 73],
            'P': [42, 58, 55, 35, 42, 37, 49, 16, 46, 29, 32, 28, 27, 36, 60, 50, 60, 50, 40, 18, 17, 25],
            'K': [43, 41, 44, 40, 42, 42, 42, 20, 41, 60, 78, 82, 30, 60, 49, 26, 30, 8, 9, 30, 50, 10],
            'temperature': [20.8, 21.8, 23.6, 26.0, 18.7, 22.7, 24.0, 29.4, 26.4, 28.6, 28.0, 28.0, 28.0, 27.0, 22.0, 23.4, 22.0, 24.0, 29.0, 27.0, 27.0, 25.0],
            'humidity': [82.0, 80.3, 70.3, 80.9, 92.6, 92.1, 83.8, 70.3, 80.6, 94.6, 65.1, 58.0, 58.0, 69.0, 92.0, 83.0, 92.0, 80.0, 85.0, 69.0, 69.0, 83.0],
            'ph': [6.5, 7.0, 7.0, 7.4, 7.2, 5.6, 6.2, 7.1, 7.0, 7.1, 6.9, 7.0, 6.8, 6.9, 7.0, 6.3, 6.6, 6.9, 6.7, 6.9, 6.9, 6.8],
            'rainfall': [202.9, 226.6, 239.7, 250.1, 284.3, 295.7, 230.9, 240.7, 230.9, 205.0, 70.3, 55.7, 80.0, 120.0, 150.0, 140.0, 150.0, 200.0, 220.0, 120.0, 120.0, 140.0],
            'label': ['rice', 'wheat', 'mungbean', 'Tea', 'millet', 'maize', 'lentil', 'jute', 'coffee', 'cotton', 'jute', 'coffee', 'rice', 'rice', 'maize', 'lentil', 'lentil', 'jute', 'jute', 'rice', 'rice', 'lentil']
        }
        self.crop_data = pd.DataFrame(data)

    def train_model(self):
        """Train the crop recommendation model"""
        try:
            # Prepare features and target
            X = self.crop_data[self.feature_columns]
            y = self.crop_data['label']

            # Encode target labels
            self.label_encoder = LabelEncoder()
            y_encoded = self.label_encoder.fit_transform(y)

            # Scale features
            self.scaler = StandardScaler()
            X_scaled = self.scaler.fit_transform(X)

            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X_scaled, y_encoded, test_size=0.2, random_state=42
            )

            # Train model
            self.model = RandomForestClassifier(
                n_estimators=100,
                random_state=42,
                max_depth=10
            )
            self.model.fit(X_train, y_train)

            # Evaluate model
            y_pred = self.model.predict(X_test)
            accuracy = accuracy_score(y_test, y_pred)
            print(f"Model accuracy: {accuracy:.2f}")

            # Save model
            os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
            model_data = {
                'model': self.model,
                'label_encoder': self.label_encoder,
                'scaler': self.scaler,
                'feature_columns': self.feature_columns
            }
            joblib.dump(model_data, self.model_path)

            return accuracy

        except Exception as e:
            print(f"Error training model: {e}")
            return 0.0

    def load_model(self):
        """Load trained model from disk"""
        try:
            if os.path.exists(self.model_path):
                model_data = joblib.load(self.model_path)
                self.model = model_data['model']
                self.label_encoder = model_data['label_encoder']
                self.scaler = model_data['scaler']
                self.feature_columns = model_data['feature_columns']
                return True
            else:
                print("Model file not found, training new model...")
                return self.train_model() > 0
        except Exception as e:
            print(f"Error loading model: {e}")
            return False

    def predict_crop(self, features: Dict[str, float]) -> Dict[str, Any]:
        """Predict suitable crops based on soil and weather conditions"""
        try:
            if self.model is None:
                if not self.load_model():
                    raise Exception("Failed to load or train model")

            # Prepare input features
            input_data = []
            for col in self.feature_columns:
                value = features.get(col.lower(), 0)
                input_data.append(value)

            input_array = np.array(input_data).reshape(1, -1)
            input_scaled = self.scaler.transform(input_array)

            # Get prediction probabilities
            probabilities = self.model.predict_proba(input_scaled)[0]

            # Get top 3 predictions
            top_indices = np.argsort(probabilities)[-3:][::-1]
            top_crops = self.label_encoder.inverse_transform(top_indices)
            top_probabilities = probabilities[top_indices]

            # Create response
            recommendations = []
            confidence_scores = {}

            for crop, prob in zip(top_crops, top_probabilities):
                recommendations.append({
                    'crop': crop,
                    'confidence': float(prob),
                    'suitability': self._get_crop_info(crop)
                })
                confidence_scores[crop] = float(prob)

            return {
                'recommended_crops': recommendations,
                'confidence_scores': confidence_scores,
                'reasoning': self._generate_reasoning(features, top_crops[0])
            }

        except Exception as e:
            print(f"Error in prediction: {e}")
            return self._get_fallback_recommendation()

    def _get_crop_info(self, crop: str) -> Dict[str, Any]:
        """Get additional information about a crop"""
        crop_info = {
            'rice': {
                'season': 'Kharif',
                'water_requirement': 'High',
                'duration': '120-150 days',
                'profitability': 'Medium'
            },
            'wheat': {
                'season': 'Rabi',
                'water_requirement': 'Medium',
                'duration': '120-140 days',
                'profitability': 'High'
            },
            'maize': {
                'season': 'Kharif',
                'water_requirement': 'Medium',
                'duration': '90-110 days',
                'profitability': 'High'
            },
            'cotton': {
                'season': 'Kharif',
                'water_requirement': 'Medium',
                'duration': '150-180 days',
                'profitability': 'High'
            }
        }
        return crop_info.get(crop.lower(), {
            'season': 'Varies',
            'water_requirement': 'Medium',
            'duration': 'Varies',
            'profitability': 'Medium'
        })

    def _generate_reasoning(self, features: Dict[str, float], top_crop: str) -> str:
        """Generate human-readable reasoning for the recommendation"""
        reasoning_parts = []

        # Temperature reasoning
        temp = features.get('temperature', 25)
        if temp < 15:
            reasoning_parts.append("Cool temperature favors winter crops")
        elif temp > 30:
            reasoning_parts.append("Hot temperature suggests heat-tolerant crops")
        else:
            reasoning_parts.append("Moderate temperature suitable for various crops")

        # Rainfall reasoning
        rainfall = features.get('rainfall', 100)
        if rainfall < 50:
            reasoning_parts.append("Low rainfall suggests drought-resistant crops")
        elif rainfall > 200:
            reasoning_parts.append("High rainfall favors water-loving crops")

        # Soil pH reasoning
        ph = features.get('ph', 7.0)
        if ph < 6.0:
            reasoning_parts.append("Acidic soil may need lime treatment")
        elif ph > 7.5:
            reasoning_parts.append("Alkaline soil may need sulfur treatment")

        reasoning = f"Based on your conditions, {top_crop} appears to be the best choice. " + " ".join(reasoning_parts)
        return reasoning

    def _get_fallback_recommendation(self) -> Dict[str, Any]:
        """Provide fallback recommendation when model fails"""
        return {
            'recommended_crops': [{
                'crop': 'rice',
                'confidence': 0.5,
                'suitability': self._get_crop_info('rice')
            }],
            'confidence_scores': {'rice': 0.5},
            'reasoning': 'Using fallback recommendation due to technical issues'
        }

    def analyze_soil(self, soil_data: Dict[str, float]) -> Dict[str, Any]:
        """Analyze soil health and provide recommendations"""
        n = soil_data.get('nitrogen', 0)
        p = soil_data.get('phosphorus', 0)
        k = soil_data.get('potassium', 0)
        ph = soil_data.get('ph_level', 7.0)
        organic = soil_data.get('organic_matter', 0)

        analysis = {
            'soil_health': 'good',
            'recommendations': [],
            'nutrient_levels': {
                'nitrogen': self._classify_nutrient(n, 'nitrogen'),
                'phosphorus': self._classify_nutrient(p, 'phosphorus'),
                'potassium': self._classify_nutrient(k, 'potassium')
            },
            'ph_status': self._classify_ph(ph),
            'organic_matter': self._classify_organic_matter(organic)
        }

        # Generate recommendations
        if n < 50:
            analysis['recommendations'].append("Add nitrogen-rich fertilizers like urea")
        if p < 30:
            analysis['recommendations'].append("Apply phosphorus fertilizers like DAP")
        if k < 30:
            analysis['recommendations'].append("Use potassium fertilizers like MOP")

        if ph < 6.0:
            analysis['recommendations'].append("Apply lime to raise soil pH")
        elif ph > 7.5:
            analysis['recommendations'].append("Apply sulfur to lower soil pH")

        if organic < 2.0:
            analysis['recommendations'].append("Add organic matter through compost or manure")

        return analysis

    def _classify_nutrient(self, value: float, nutrient: str) -> str:
        """Classify nutrient level"""
        thresholds = {
            'nitrogen': [50, 100],
            'phosphorus': [30, 60],
            'potassium': [30, 60]
        }

        low, high = thresholds.get(nutrient, [50, 100])
        if value < low:
            return 'low'
        elif value < high:
            return 'medium'
        else:
            return 'high'

    def _classify_ph(self, ph: float) -> str:
        """Classify soil pH"""
        if ph < 5.5:
            return 'strongly_acidic'
        elif ph < 6.0:
            return 'acidic'
        elif ph < 7.0:
            return 'slightly_acidic'
        elif ph < 7.5:
            return 'neutral'
        elif ph < 8.0:
            return 'slightly_alkaline'
        else:
            return 'alkaline'

    def _classify_organic_matter(self, value: float) -> str:
        """Classify organic matter content"""
        if value < 1.0:
            return 'very_low'
        elif value < 2.0:
            return 'low'
        elif value < 3.0:
            return 'medium'
        else:
            return 'high'

    def get_market_insights(self, crop_type: Optional[str] = None, location: Optional[str] = None) -> Dict[str, Any]:
        """Get market price predictions and insights"""
        # This would typically integrate with market data APIs
        # For now, return mock data
        insights = {
            'current_prices': {},
            'price_trends': {},
            'recommendations': []
        }

        if crop_type:
            insights['current_prices'][crop_type] = {
                'price_per_kg': 25.0,
                'trend': 'stable',
                'forecast': 'Expected to rise by 5% next month'
            }
            insights['recommendations'].append(f"Consider selling {crop_type} soon if prices are favorable")

        return insights

    def get_weather_advice(self, weather_data: Dict[str, float]) -> Dict[str, Any]:
        """Provide farming advice based on weather conditions"""
        temp = weather_data.get('temperature', 25)
        humidity = weather_data.get('humidity', 60)
        rainfall = weather_data.get('rainfall', 0)
        wind_speed = weather_data.get('wind_speed', 5)
        crop_stage = weather_data.get('crop_stage', 'vegetative')

        advice = {
            'immediate_actions': [],
            'risks': [],
            'recommendations': []
        }

        # Temperature advice
        if temp > 35:
            advice['risks'].append("Heat stress risk")
            advice['immediate_actions'].append("Provide shade or mulch")
        elif temp < 10:
            advice['risks'].append("Cold damage risk")
            advice['immediate_actions'].append("Cover crops if frost expected")

        # Rainfall advice
        if rainfall > 50:
            advice['risks'].append("Waterlogging risk")
            advice['immediate_actions'].append("Ensure proper drainage")
        elif rainfall < 5 and crop_stage in ['flowering', 'grain_filling']:
            advice['risks'].append("Drought stress")
            advice['immediate_actions'].append("Irrigate immediately")

        # Wind advice
        if wind_speed > 20:
            advice['risks'].append("Wind damage to crops")
            advice['immediate_actions'].append("Stake tall plants")

        return advice