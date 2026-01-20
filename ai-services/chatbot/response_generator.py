import json
import random
from typing import Dict, List, Any, Optional
from datetime import datetime
import re
from .basic_training import BasicTrainingData

class ResponseGenerator:
    def __init__(self):
        self.basic_training = BasicTrainingData()
        self.fallback_responses = self._load_fallback_responses()

    def _load_response_templates(self) -> Dict[str, Dict[str, Any]]:
        """Load response templates for different intents"""
        return {
            'crop_recommendation': {
                'responses': [
                    "Based on your location and soil conditions, I recommend considering {crops}. Would you like me to provide more details about these crops?",
                    "For your area, {crops} would be excellent choices. I can help you with detailed cultivation practices for any of these.",
                    "Considering the current season and your soil type, I suggest {crops}. Each has different requirements - which one interests you most?"
                ],
                'follow_up_questions': [
                    "Could you tell me your soil type (clay, sandy, loamy)?",
                    "What's your location or region?",
                    "What season are you planning to plant in?",
                    "Do you have any specific preferences or constraints?"
                ]
            },
            'disease_identification': {
                'responses': [
                    "It sounds like your plant might have a disease issue. Could you upload a clear photo of the affected area for accurate identification?",
                    "Plant diseases can be identified through visual symptoms. Please share an image of the affected leaves or stems.",
                    "I can help identify plant diseases using image analysis. Would you like to upload a photo for diagnosis?"
                ],
                'follow_up_questions': [
                    "What type of crop or plant is affected?",
                    "When did you first notice these symptoms?",
                    "Have you applied any treatments already?"
                ]
            },
            'weather_advice': {
                'responses': [
                    "Weather plays a crucial role in farming. I can provide specific advice based on current conditions. What's your location?",
                    "Different weather conditions require different farming approaches. Tell me about your current weather situation.",
                    "Weather-based farming decisions are important. I can help with irrigation, planting, and protection advice."
                ],
                'follow_up_questions': [
                    "What's the current temperature in your area?",
                    "Has it rained recently? How much?",
                    "What crop stage are your plants in?",
                    "What's the humidity level?"
                ]
            },
            'market_prices': {
                'responses': [
                    "Market prices fluctuate regularly. I can provide current price information for various crops. Which crop are you interested in?",
                    "Understanding market prices helps in making better farming decisions. What produce are you planning to sell?",
                    "I can help you with current market rates and price trends. Let me know which commodity you're asking about."
                ],
                'follow_up_questions': [
                    "Which crop's price information do you need?",
                    "Are you looking for local market prices or wholesale rates?",
                    "What's your location for region-specific prices?"
                ]
            },
            'fertilizer_advice': {
                'responses': [
                    "Proper fertilization is key to good crop yields. I can recommend suitable fertilizers based on your soil and crop needs.",
                    "Different crops need different nutrient balances. Tell me about your crop and soil type for specific recommendations.",
                    "Soil testing and appropriate fertilization can significantly improve your yields. What crop are you growing?"
                ],
                'follow_up_questions': [
                    "What crop are you fertilizing?",
                    "Have you done a soil test recently?",
                    "What are your current NPK levels?",
                    "Are you looking for organic or chemical fertilizers?"
                ]
            },
            'pest_control': {
                'responses': [
                    "Effective pest management combines prevention and treatment. I can guide you on integrated pest management approaches.",
                    "Pest control should be targeted and environmentally friendly. What type of pest problem are you facing?",
                    "There are many pest control options available. Let me help you choose the most appropriate method for your situation."
                ],
                'follow_up_questions': [
                    "What type of pest are you dealing with?",
                    "What crop is affected?",
                    "Have you tried any control measures already?",
                    "Do you prefer organic or chemical solutions?"
                ]
            },
            'government_schemes': {
                'responses': [
                    "There are several government schemes available for farmers. I can provide information about various agricultural support programs.",
                    "Government schemes can provide financial and technical support for farming. Which type of assistance are you looking for?",
                    "From subsidies to insurance, there are many schemes to support farmers. Let me help you find the right ones for your needs."
                ],
                'follow_up_questions': [
                    "What type of scheme are you interested in (subsidies, loans, insurance)?",
                    "Are you looking for crop-specific schemes?",
                    "What's your location for state-specific schemes?"
                ]
            },
            'farming_techniques': {
                'responses': [
                    "Modern farming techniques can improve efficiency and sustainability. What aspect of farming are you interested in learning about?",
                    "There are many innovative farming methods available. I can share information about various techniques and best practices.",
                    "Sustainable farming practices help in long-term productivity. Which farming technique would you like to know more about?"
                ],
                'follow_up_questions': [
                    "What specific farming technique interests you?",
                    "Are you looking for organic farming methods?",
                    "What crop are you focusing on?",
                    "Do you have any specific challenges you're trying to address?"
                ]
            },
            'general_help': {
                'responses': [
                    "I'm here to help you with all your farming needs! I can assist with crop recommendations, disease identification, weather advice, market information, and much more.",
                    "As your agricultural assistant, I can help with crop selection, pest management, fertilization advice, market prices, and government schemes.",
                    "I provide comprehensive farming support including crop recommendations, disease diagnosis, weather-based advice, and market intelligence."
                ],
                'follow_up_questions': [
                    "What specific farming topic would you like help with?",
                    "Are you looking for crop recommendations?",
                    "Do you need help with a plant disease?",
                    "Are you interested in market prices or weather advice?"
                ]
            }
        }

    def _load_fallback_responses(self) -> List[str]:
        """Load fallback responses for unrecognized inputs"""
        return [
            "I'm not sure I understood that correctly. Could you please rephrase your question?",
            "I want to help you with farming-related questions. Could you be more specific about what you need?",
            "I'm here to assist with agricultural advice. What farming topic can I help you with today?",
            "Let me help you with your farming needs. Could you tell me more about what you're looking for?"
        ]

    def generate_response(self,
                         intent: str,
                         confidence: float,
                         entities: Dict[str, Any],
                         context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Generate a response based on intent, confidence, and entities

        Args:
            intent: Classified intent
            confidence: Confidence score
            entities: Extracted entities
            context: Conversation context

        Returns:
            Dictionary with response and metadata
        """

        try:
            # Use basic training data for responses
            response_data = self.basic_training.get_response(intent, entities)

            # Add additional metadata
            response_data.update({
                'entities': entities,
                'context_used': context is not None,
                'response_type': 'basic_training'
            })

            return response_data

        except Exception as e:
            print(f"Error generating response: {e}")
            return self._generate_fallback_response()

    def _personalize_response(self, response: str, entities: Dict[str, Any]) -> str:
        """Personalize response using extracted entities"""
        try:
            # Replace crop placeholders
            if '{crops}' in response and entities.get('crops'):
                crops = entities['crops'][:3]  # Limit to 3 crops
                crops_text = ', '.join(crops)
                response = response.replace('{crops}', crops_text)

            # Add location context
            if entities.get('locations'):
                location = entities['locations'][0]
                response += f" (considering your location in {location})"

            # Add crop context
            if entities.get('crops'):
                crop = entities['crops'][0]
                if 'crop' not in response.lower():
                    response = f"For your {crop} crop: {response}"

            return response

        except Exception as e:
            print(f"Error personalizing response: {e}")
            return response

    def _get_suggested_actions(self, intent: str, entities: Dict[str, Any]) -> List[str]:
        """Get suggested actions based on intent and entities"""
        actions = {
            'crop_recommendation': [
                'Get detailed cultivation guide',
                'Check soil requirements',
                'View market prices',
                'Get weather-based advice'
            ],
            'disease_identification': [
                'Upload plant image for diagnosis',
                'Get treatment recommendations',
                'Learn prevention methods',
                'Check for similar symptoms'
            ],
            'weather_advice': [
                'Check current weather',
                'Get irrigation schedule',
                'Plan planting activities',
                'Prepare for weather events'
            ],
            'market_prices': [
                'View current prices',
                'Check price trends',
                'Find nearby markets',
                'Get selling tips'
            ],
            'fertilizer_advice': [
                'Get soil test recommendations',
                'View fertilizer calculator',
                'Learn application methods',
                'Check organic alternatives'
            ],
            'pest_control': [
                'Identify pest type',
                'Get control methods',
                'Learn prevention techniques',
                'Check organic solutions'
            ],
            'government_schemes': [
                'Browse available schemes',
                'Check eligibility criteria',
                'Apply for schemes',
                'Get application help'
            ],
            'farming_techniques': [
                'Browse farming methods',
                'Get detailed guides',
                'Watch tutorial videos',
                'Connect with experts'
            ]
        }

        return actions.get(intent, ['Get more information', 'Ask a specific question'])

    def _check_if_more_info_needed(self, intent: str, entities: Dict[str, Any]) -> bool:
        """Check if more information is needed for a complete response"""
        info_requirements = {
            'crop_recommendation': ['locations', 'crops'],
            'disease_identification': ['crops', 'problems'],
            'weather_advice': ['locations'],
            'market_prices': ['crops'],
            'fertilizer_advice': ['crops'],
            'pest_control': ['crops', 'problems']
        }

        required_entities = info_requirements.get(intent, [])
        return not all(entities.get(entity, []) for entity in required_entities)

    def _generate_fallback_response(self) -> Dict[str, Any]:
        """Generate fallback response for low confidence or errors"""
        return {
            'response': random.choice(self.fallback_responses),
            'intent': 'unknown',
            'confidence': 0.0,
            'follow_up_question': 'What farming topic would you like help with?',
            'suggested_actions': ['Browse help topics', 'Ask about crop recommendations', 'Get weather advice'],
            'timestamp': datetime.utcnow().isoformat(),
            'needs_more_info': True
        }

    def generate_contextual_response(self,
                                   message: str,
                                   context: Dict[str, Any],
                                   intent: str,
                                   confidence: float) -> Dict[str, Any]:
        """Generate response considering conversation context"""
        try:
            # Check if this is a follow-up question
            if context.get('pending_question'):
                return self._handle_follow_up(message, context, intent, confidence)

            # Check for clarification requests
            if self._is_clarification_request(message):
                return self._handle_clarification(context)

            # Generate normal response
            entities = {}  # Would be extracted by intent handler
            return self.generate_response(intent, confidence, entities, context)

        except Exception as e:
            print(f"Error in contextual response: {e}")
            return self._generate_fallback_response()

    def _handle_follow_up(self,
                         message: str,
                         context: Dict[str, Any],
                         intent: str,
                         confidence: float) -> Dict[str, Any]:
        """Handle follow-up responses"""
        # This would contain logic to process answers to previous questions
        # For now, generate a normal response
        entities = {}
        return self.generate_response(intent, confidence, entities, context)

    def _is_clarification_request(self, message: str) -> bool:
        """Check if message is asking for clarification"""
        clarification_keywords = ['what do you mean', 'clarify', 'explain', 'what is', 'how does']
        return any(keyword in message.lower() for keyword in clarification_keywords)

    def _handle_clarification(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Handle clarification requests"""
        last_intent = context.get('last_intent', 'general_help')

        clarification_responses = {
            'crop_recommendation': "I can recommend crops based on your soil type, location, and season. I consider factors like temperature, rainfall, and soil nutrients.",
            'disease_identification': "I can help identify plant diseases by analyzing photos of affected plants. I look for symptoms like spots, discoloration, or wilting.",
            'weather_advice': "I provide weather-based farming advice including when to irrigate, plant, or protect crops from extreme weather conditions."
        }

        response = clarification_responses.get(
            last_intent,
            "I'm an AI assistant specialized in agricultural advice. I can help with crop recommendations, disease identification, weather advice, market information, and farming techniques."
        )

        return {
            'response': response,
            'intent': 'clarification',
            'confidence': 1.0,
            'follow_up_question': 'Does this help, or would you like me to explain something else?',
            'suggested_actions': ['Continue conversation', 'Ask another question'],
            'timestamp': datetime.utcnow().isoformat(),
            'needs_more_info': False
        }

    def get_response_templates(self, intent: str) -> Dict[str, Any]:
        """Get response templates for an intent"""
        return self.response_templates.get(intent, {})

    def add_custom_response(self, intent: str, response: str, follow_up: str = None):
        """Add custom response template"""
        if intent not in self.response_templates:
            self.response_templates[intent] = {
                'responses': [],
                'follow_up_questions': []
            }

        self.response_templates[intent]['responses'].append(response)
        if follow_up:
            self.response_templates[intent]['follow_up_questions'].append(follow_up)