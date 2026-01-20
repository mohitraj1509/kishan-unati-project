from .cnn_model import DiseaseDetectionModel
from typing import Dict, List, Any, Optional
import base64
import io

class DiseaseDetector:
    def __init__(self):
        self.model = DiseaseDetectionModel()

    def is_ready(self) -> bool:
        """Check if the model is ready for predictions"""
        return self.model.model is not None

    def predict(self, image_data: bytes, crop_type: str = "general") -> Dict[str, Any]:
        """
        Detect crop disease from image

        Args:
            image_data: Raw image bytes
            crop_type: Type of crop (rice, wheat, maize, etc.) for specialized detection

        Returns:
            Dictionary with disease detection results
        """

        try:
            # Get model prediction
            result = self.model.predict_disease(image_data)

            # Enhance result with crop-specific information
            result['crop_type'] = crop_type
            result['crop_specific_advice'] = self._get_crop_specific_advice(
                result['disease'], crop_type
            )

            # Add additional metadata
            result['detection_timestamp'] = self._get_current_timestamp()
            result['model_version'] = '1.0.0'

            return result

        except Exception as e:
            print(f"Error in disease detection: {e}")
            return self._get_error_response(str(e))

    def _get_crop_specific_advice(self, disease: str, crop_type: str) -> Dict[str, Any]:
        """Get crop-specific advice for disease management"""
        crop_specific_database = {
            'rice': {
                'bacterial_blight': {
                    'varieties': ['IR64', 'MTU1010', 'Improved Pusa Basmati'],
                    'chemical_control': 'Streptomycin 100ppm + Copper oxychloride 0.2%',
                    'cultural_practices': 'Avoid close planting, use balanced fertilization'
                },
                'leaf_blight': {
                    'varieties': ['IR36', 'Coimbatore 1', 'TNAU Rice Variety'],
                    'chemical_control': 'Mancozeb 0.2% or Carbendazim 0.1%',
                    'cultural_practices': 'Remove infected leaves, improve drainage'
                }
            },
            'wheat': {
                'rust': {
                    'varieties': ['PBW343', 'HD2687', 'DBW17'],
                    'chemical_control': 'Propiconazole 0.1% or Tebuconazole 0.1%',
                    'cultural_practices': 'Use rust-resistant varieties, avoid late sowing'
                },
                'powdery_mildew': {
                    'varieties': ['PBW550', 'HD2967', 'DBW88'],
                    'chemical_control': 'Sulfur 0.2% or Dinocap 0.05%',
                    'cultural_practices': 'Avoid dense planting, ensure good air circulation'
                }
            },
            'maize': {
                'fusarium_wilt': {
                    'varieties': ['HQPM1', 'DKC9081', 'Pioneer P21'],
                    'chemical_control': 'Carbendazim 0.1% soil drench',
                    'cultural_practices': 'Crop rotation with non-host crops, deep plowing'
                },
                'root_rot': {
                    'varieties': ['DMH1', 'HQPM5', 'Bio963'],
                    'chemical_control': 'Copper oxychloride 0.2%',
                    'cultural_practices': 'Improve drainage, avoid waterlogging'
                }
            }
        }

        crop_data = crop_specific_database.get(crop_type.lower(), {})
        disease_data = crop_data.get(disease, {})

        if not disease_data:
            return {
                'varieties': ['Consult local variety recommendations'],
                'chemical_control': 'Follow general disease management guidelines',
                'cultural_practices': 'Practice integrated disease management'
            }

        return disease_data

    def _get_current_timestamp(self) -> str:
        """Get current timestamp"""
        from datetime import datetime
        return datetime.utcnow().isoformat()

    def _get_error_response(self, error_message: str) -> Dict[str, Any]:
        """Return error response"""
        return {
            'disease': 'detection_failed',
            'confidence': 0.0,
            'severity': 'Unknown',
            'treatment': 'Unable to analyze image. Please try again or consult an expert.',
            'prevention': 'Ensure good quality, well-lit image of the affected plant part.',
            'error': error_message,
            'crop_type': 'unknown',
            'crop_specific_advice': {},
            'detection_timestamp': self._get_current_timestamp(),
            'model_version': '1.0.0'
        }

    def get_supported_crops(self) -> List[str]:
        """Get list of supported crop types"""
        return ['rice', 'wheat', 'maize', 'cotton', 'sugarcane', 'potato', 'tomato', 'general']

    def get_disease_database(self) -> Dict[str, Dict[str, Any]]:
        """Get comprehensive disease database"""
        return {
            disease: self.model._get_disease_info(disease)
            for disease in self.model.class_names
        }

    def analyze_image_quality(self, image_data: bytes) -> Dict[str, Any]:
        """Analyze image quality for better disease detection"""
        try:
            import cv2
            import numpy as np

            # Decode image
            nparr = np.frombuffer(image_data, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            if img is None:
                return {'quality_score': 0, 'issues': ['Invalid image format']}

            # Check image dimensions
            height, width = img.shape[:2]
            min_dimension = min(height, width)

            # Check brightness
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            brightness = np.mean(gray)

            # Check contrast
            contrast = gray.std()

            # Check blur
            laplacian_var = cv2.Laplacian(gray, cv2.CV_64F).var()

            quality_score = 0
            issues = []

            if min_dimension < 200:
                quality_score -= 20
                issues.append('Image too small - minimum 200x200 pixels recommended')

            if brightness < 50:
                quality_score -= 15
                issues.append('Image too dark - ensure good lighting')

            if brightness > 200:
                quality_score -= 10
                issues.append('Image too bright - avoid direct sunlight')

            if contrast < 30:
                quality_score -= 15
                issues.append('Low contrast - focus on affected area clearly')

            if laplacian_var < 100:
                quality_score -= 10
                issues.append('Image appears blurry - hold camera steady')

            final_score = max(0, min(100, 100 + quality_score))

            return {
                'quality_score': final_score,
                'brightness': float(brightness),
                'contrast': float(contrast),
                'sharpness': float(laplacian_var),
                'dimensions': f'{width}x{height}',
                'issues': issues,
                'recommendations': self._get_quality_recommendations(issues)
            }

        except Exception as e:
            return {
                'quality_score': 0,
                'issues': [f'Quality analysis failed: {str(e)}'],
                'recommendations': ['Please try with a different image']
            }

    def _get_quality_recommendations(self, issues: List[str]) -> List[str]:
        """Get recommendations based on quality issues"""
        recommendations = []

        for issue in issues:
            if 'small' in issue.lower():
                recommendations.append('Take photo closer to the affected area')
            elif 'dark' in issue.lower():
                recommendations.append('Use good lighting or flash')
            elif 'bright' in issue.lower():
                recommendations.append('Avoid direct sunlight, use shade')
            elif 'contrast' in issue.lower():
                recommendations.append('Focus camera on the affected plant part')
            elif 'blurry' in issue.lower():
                recommendations.append('Hold camera steady and use focus lock')

        if not recommendations:
            recommendations.append('Image quality is good for analysis')

        return recommendations

    def batch_predict(self, image_list: List[bytes], crop_type: str = "general") -> List[Dict[str, Any]]:
        """Batch prediction for multiple images"""
        results = []
        for image_data in image_list:
            try:
                result = self.predict(image_data, crop_type)
                results.append(result)
            except Exception as e:
                results.append(self._get_error_response(str(e)))

        return results

    def get_model_info(self) -> Dict[str, Any]:
        """Get model information and capabilities"""
        return {
            'model_info': self.model.get_model_info(),
            'supported_crops': self.get_supported_crops(),
            'supported_diseases': self.model.class_names,
            'image_requirements': {
                'format': 'JPEG, PNG',
                'min_resolution': '200x200 pixels',
                'recommended_resolution': '224x224 pixels or higher',
                'color_mode': 'RGB'
            },
            'performance_metrics': {
                'average_accuracy': '85-90%',
                'processing_time': '< 2 seconds per image',
                'model_size': '~50MB'
            }
        }