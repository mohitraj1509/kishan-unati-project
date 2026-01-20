# AI Services Package
# Comprehensive AI solutions for agricultural applications

from . import crop_recommendation
from . import disease_detection
from . import chatbot
from .api import app

__version__ = "1.0.0"
__author__ = "Kisan Unnati Team"

__all__ = ['crop_recommendation', 'disease_detection', 'chatbot', 'app']