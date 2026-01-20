from .model import CropRecommendationModel
from typing import Dict, List, Any, Optional
import json

class CropRecommender:
    def __init__(self):
        self.model = CropRecommendationModel()

    def is_ready(self) -> bool:
        """Check if the model is ready for predictions"""
        return self.model.load_model()

    def predict(self,
                soil_type: str,
                location: str,
                season: str,
                temperature: Optional[float] = None,
                rainfall: Optional[float] = None,
                ph_level: Optional[float] = None) -> Dict[str, Any]:
        """
        Get crop recommendations based on conditions

        Args:
            soil_type: Type of soil (clay, sandy, loamy, etc.)
            location: Geographic location
            season: Current season (kharif, rabi, zaid)
            temperature: Temperature in Celsius
            rainfall: Rainfall in mm
            ph_level: Soil pH level

        Returns:
            Dictionary with recommendations and confidence scores
        """

        # Convert inputs to model features
        features = self._prepare_features(
            soil_type, location, season, temperature, rainfall, ph_level
        )

        # Get model prediction
        result = self.model.predict_crop(features)

        # Enhance result with additional context
        result['input_conditions'] = {
            'soil_type': soil_type,
            'location': location,
            'season': season,
            'temperature': temperature,
            'rainfall': rainfall,
            'ph_level': ph_level
        }

        return result

    def _prepare_features(self,
                         soil_type: str,
                         location: str,
                         season: str,
                         temperature: Optional[float],
                         rainfall: Optional[float],
                         ph_level: Optional[float]) -> Dict[str, float]:
        """
        Convert input parameters to model features
        """

        # Default values based on typical conditions
        features = {
            'n': 50.0,  # Nitrogen
            'p': 40.0,  # Phosphorus
            'k': 40.0,  # Potassium
            'temperature': temperature or self._get_seasonal_temperature(season),
            'humidity': 60.0,  # Default humidity
            'ph': ph_level or 7.0,
            'rainfall': rainfall or self._get_seasonal_rainfall(season)
        }

        # Adjust features based on soil type
        soil_adjustments = self._get_soil_adjustments(soil_type)
        features.update(soil_adjustments)

        return features

    def _get_seasonal_temperature(self, season: str) -> float:
        """Get typical temperature for the season"""
        season_temps = {
            'kharif': 28.0,  # Summer monsoon
            'rabi': 18.0,    # Winter
            'zaid': 32.0     # Summer
        }
        return season_temps.get(season.lower(), 25.0)

    def _get_seasonal_rainfall(self, season: str) -> float:
        """Get typical rainfall for the season"""
        season_rainfall = {
            'kharif': 150.0,  # Monsoon season
            'rabi': 50.0,     # Winter, less rain
            'zaid': 30.0      # Summer, minimal rain
        }
        return season_rainfall.get(season.lower(), 100.0)

    def _get_soil_adjustments(self, soil_type: str) -> Dict[str, float]:
        """Get nutrient adjustments based on soil type"""
        adjustments = {
            'clay': {'n': 60, 'p': 35, 'k': 45, 'ph': 7.2},
            'sandy': {'n': 40, 'p': 25, 'k': 35, 'ph': 6.8},
            'loamy': {'n': 50, 'p': 40, 'k': 40, 'ph': 7.0},
            'silt': {'n': 55, 'p': 38, 'k': 42, 'ph': 7.1},
            'peat': {'n': 45, 'p': 30, 'k': 38, 'ph': 6.5},
            'chalky': {'n': 48, 'p': 42, 'k': 44, 'ph': 7.8}
        }

        base_adjustments = adjustments.get(soil_type.lower(), {'n': 50, 'p': 40, 'k': 40, 'ph': 7.0})

        return {
            'n': base_adjustments['n'],
            'p': base_adjustments['p'],
            'k': base_adjustments['k'],
            'ph': base_adjustments['ph']
        }

    def analyze_soil(self, soil_data: Dict[str, float]) -> Dict[str, Any]:
        """Analyze soil health and provide recommendations"""
        return self.model.analyze_soil(soil_data)

    def get_market_insights(self, crop_type: Optional[str] = None, location: Optional[str] = None) -> Dict[str, Any]:
        """Get market price predictions and insights"""
        return self.model.get_market_insights(crop_type, location)

    def get_weather_advice(self, weather_data: Dict[str, float]) -> Dict[str, Any]:
        """Provide farming advice based on weather conditions"""
        return self.model.get_weather_advice(weather_data)

    def get_crop_calendar(self, crop: str, location: str) -> Dict[str, Any]:
        """Get detailed crop calendar and timeline"""
        crop_calendars = {
            'rice': {
                'season': 'Kharif',
                'duration': '120-150 days',
                'timeline': {
                    '0-15 days': 'Land preparation and nursery sowing',
                    '15-30 days': 'Transplanting',
                    '30-60 days': 'Tillering stage',
                    '60-90 days': 'Panicle initiation',
                    '90-120 days': 'Flowering and grain filling',
                    '120-150 days': 'Harvesting'
                },
                'critical_operations': [
                    ' timely transplanting',
                    'Proper water management',
                    'Pest monitoring during flowering'
                ]
            },
            'wheat': {
                'season': 'Rabi',
                'duration': '120-140 days',
                'timeline': {
                    '0-10 days': 'Sowing',
                    '10-30 days': 'Germination and seedling establishment',
                    '30-60 days': 'Vegetative growth',
                    '60-90 days': 'Flowering',
                    '90-120 days': 'Grain filling',
                    '120-140 days': 'Harvesting'
                },
                'critical_operations': [
                    'Sowing at right time',
                    'Irrigation at critical stages',
                    'Disease monitoring'
                ]
            },
            'maize': {
                'season': 'Kharif',
                'duration': '90-110 days',
                'timeline': {
                    '0-10 days': 'Sowing',
                    '10-25 days': 'Germination',
                    '25-50 days': 'Vegetative growth',
                    '50-70 days': 'Tasseling and silking',
                    '70-90 days': 'Grain filling',
                    '90-110 days': 'Harvesting'
                },
                'critical_operations': [
                    'Deep sowing',
                    'Adequate spacing',
                    'Timely harvesting to avoid losses'
                ]
            }
        }

        return crop_calendars.get(crop.lower(), {
            'season': 'Varies',
            'duration': 'Varies',
            'timeline': {},
            'critical_operations': []
        })

    def get_pest_alerts(self, crop: str, location: str) -> List[Dict[str, Any]]:
        """Get pest and disease alerts for specific crop and location"""
        # This would typically integrate with pest monitoring systems
        # For now, return general alerts
        general_alerts = [
            {
                'pest': 'Aphids',
                'severity': 'Medium',
                'symptoms': 'Yellowing leaves, sticky honeydew',
                'treatment': 'Neem oil spray or beneficial insects',
                'preventive_measures': 'Regular field monitoring, crop rotation'
            },
            {
                'pest': 'Stem borer',
                'severity': 'High',
                'symptoms': 'Holes in stems, wilting',
                'treatment': 'Systemic insecticides',
                'preventive_measures': 'Use resistant varieties, proper spacing'
            }
        ]

        return general_alerts

    def get_fertilizer_schedule(self, crop: str, soil_type: str) -> Dict[str, Any]:
        """Get fertilizer application schedule for specific crop and soil"""
        fertilizer_schedules = {
            'rice': {
                'basal_dose': '50:30:30 NPK kg/ha',
                'top_dressing': {
                    '30_days': '25 kg N/ha',
                    '60_days': '25 kg N/ha'
                },
                'soil_adjustments': {
                    'clay': 'Reduce phosphorus by 10%',
                    'sandy': 'Increase potassium by 15%'
                }
            },
            'wheat': {
                'basal_dose': '60:30:20 NPK kg/ha',
                'top_dressing': {
                    '30_days': '30 kg N/ha',
                    '50_days': '30 kg N/ha'
                },
                'soil_adjustments': {
                    'loamy': 'Standard dose',
                    'silt': 'Increase nitrogen by 10%'
                }
            }
        }

        schedule = fertilizer_schedules.get(crop.lower(), {
            'basal_dose': '50:25:25 NPK kg/ha',
            'top_dressing': {},
            'soil_adjustments': {}
        })

        # Adjust based on soil type
        if soil_type.lower() in schedule.get('soil_adjustments', {}):
            schedule['note'] = schedule['soil_adjustments'][soil_type.lower()]

        return schedule