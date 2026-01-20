# Disease Detection Module
# Provides AI-powered plant disease detection using computer vision

from .cnn_model import DiseaseDetectionModel
from .predict import DiseaseDetector

__all__ = ['DiseaseDetectionModel', 'DiseaseDetector']