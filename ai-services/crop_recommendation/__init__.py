# Crop Recommendation Module
# Provides AI-powered crop recommendations based on soil, weather, and location data

from .model import CropRecommendationModel
from .predict import CropRecommender

__all__ = ['CropRecommendationModel', 'CropRecommender']