"""
Complete AI Model Training Pipeline
Fully Modern & Production Ready
"""

import os
import sys
import json
import logging
from datetime import datetime
from pathlib import Path

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('training.log'),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

class AITrainingPipeline:
    def __init__(self):
        self.base_path = Path(__file__).parent
        self.models_trained = []
        self.training_results = {}
        
    def check_data_availability(self):
        """Check if required data is available"""
        logger.info("🔍 Checking data availability...")
        
        checks = {
            'crop_data': self.base_path / 'crop_recommendation' / 'data' / 'crop_data.csv',
            'disease_train': self.base_path / 'disease_detection' / 'data' / 'train',
            'chatbot_intents': self.base_path / 'chatbot' / 'data' / 'intents.json'
        }
        
        available = {}
        for name, path in checks.items():
            exists = path.exists()
            available[name] = exists
            status = "✅ Found" if exists else "❌ Missing"
            logger.info(f"{status}: {name} at {path}")
            
        return available
    
    def train_crop_model(self):
        """Train crop recommendation model"""
        logger.info("🌾 Training Crop Recommendation Model...")
        
        try:
            from crop_recommendation.model import CropRecommendationModel
            
            model = CropRecommendationModel()
            accuracy = model.train_model()
            
            self.models_trained.append('crop_recommendation')
            self.training_results['crop_recommendation'] = {
                'accuracy': accuracy,
                'status': 'success',
                'timestamp': datetime.now().isoformat()
            }
            
            logger.info(f"✅ Crop model trained successfully! Accuracy: {accuracy:.2%}")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error training crop model: {e}")
            self.training_results['crop_recommendation'] = {
                'status': 'failed',
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
            return False
    
    def train_disease_model(self):
        """Train disease detection model"""
        logger.info("🔬 Training Disease Detection Model...")
        
        try:
            from disease_detection.train_disease import train_disease_detection
            
            result = train_disease_detection()
            
            self.models_trained.append('disease_detection')
            self.training_results['disease_detection'] = {
                'accuracy': result.get('accuracy', 0),
                'status': 'success',
                'timestamp': datetime.now().isoformat()
            }
            
            logger.info(f"✅ Disease detection model trained successfully!")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error training disease model: {e}")
            self.training_results['disease_detection'] = {
                'status': 'failed',
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
            return False
    
    def train_chatbot(self):
        """Train chatbot model"""
        logger.info("🤖 Training Chatbot Model...")
        
        try:
            from chatbot.basic_training import train_chatbot
            
            result = train_chatbot()
            
            self.models_trained.append('chatbot')
            self.training_results['chatbot'] = {
                'accuracy': result.get('accuracy', 0),
                'status': 'success',
                'timestamp': datetime.now().isoformat()
            }
            
            logger.info(f"✅ Chatbot trained successfully!")
            return True
            
        except Exception as e:
            logger.error(f"❌ Error training chatbot: {e}")
            self.training_results['chatbot'] = {
                'status': 'failed',
                'error': str(e),
                'timestamp': datetime.now().isoformat()
            }
            return False
    
    def save_training_report(self):
        """Save training report"""
        report = {
            'training_date': datetime.now().isoformat(),
            'models_trained': self.models_trained,
            'results': self.training_results
        }
        
        report_path = self.base_path / 'training_report.json'
        with open(report_path, 'w') as f:
            json.dump(report, f, indent=2)
        
        logger.info(f"📄 Training report saved to: {report_path}")
    
    def run_complete_training(self):
        """Run complete training pipeline"""
        logger.info("="*60)
        logger.info("🚀 Starting Complete AI Training Pipeline")
        logger.info("="*60)
        
        # Check data
        available = self.check_data_availability()
        
        # Train models
        if available.get('crop_data'):
            self.train_crop_model()
        else:
            logger.warning("⚠️ Skipping crop model - no data found")
        
        if available.get('disease_train'):
            self.train_disease_model()
        else:
            logger.warning("⚠️ Skipping disease model - no data found")
        
        if available.get('chatbot_intents'):
            self.train_chatbot()
        else:
            logger.warning("⚠️ Skipping chatbot - no data found")
        
        # Save report
        self.save_training_report()
        
        # Summary
        logger.info("="*60)
        logger.info("📊 Training Summary")
        logger.info("="*60)
        logger.info(f"Models Trained: {len(self.models_trained)}")
        for model, result in self.training_results.items():
            status = result['status']
            emoji = "✅" if status == 'success' else "❌"
            logger.info(f"{emoji} {model}: {status}")
            if status == 'success' and 'accuracy' in result:
                logger.info(f"   Accuracy: {result['accuracy']:.2%}")
        
        logger.info("="*60)
        logger.info("🎉 Training Pipeline Complete!")
        logger.info("="*60)

if __name__ == "__main__":
    pipeline = AITrainingPipeline()
    pipeline.run_complete_training()
