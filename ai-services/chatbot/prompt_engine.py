import openai
import os
from typing import Dict, List, Any, Optional
from datetime import datetime
import json

class PromptEngine:
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv('OPENAI_API_KEY')
        if self.api_key:
            openai.api_key = self.api_key
        self.model = "gpt-3.5-turbo"
        self.max_tokens = 500
        self.temperature = 0.7

        # Load system prompts
        self.system_prompts = self._load_system_prompts()

    def _load_system_prompts(self) -> Dict[str, str]:
        """Load system prompts for different conversation types"""
        return {
            'agricultural_assistant': """
You are Kisan Unnati, an expert agricultural AI assistant specialized in helping Indian farmers.
Your knowledge covers:
- Crop recommendations based on soil, climate, and location
- Disease identification and treatment
- Weather-based farming advice
- Market prices and trends
- Government schemes and subsidies
- Modern farming techniques
- Pest and weed management
- Soil health and fertilization

Guidelines:
- Always be helpful, accurate, and culturally sensitive
- Use simple, clear language that farmers can understand
- Provide practical, actionable advice
- When unsure, recommend consulting local agricultural experts
- Be encouraging and supportive of sustainable farming practices
- Include relevant local context when possible
- Suggest cost-effective solutions

Remember: You're helping real farmers with their livelihoods, so be thorough but concise.
""",
            'crop_specialist': """
You are a crop recommendation specialist for Kisan Unnati.
Focus on:
- Matching crops to soil types, climate, and seasons
- Considering market demand and profitability
- Providing cultivation best practices
- Risk assessment and mitigation strategies

Always consider the farmer's location, resources, and experience level.
""",
            'disease_expert': """
You are a plant pathology expert for Kisan Unnati.
Specialize in:
- Visual disease identification
- Treatment recommendations
- Prevention strategies
- Integrated disease management

Emphasize early detection and organic solutions when possible.
""",
            'market_analyst': """
You are a agricultural market analyst for Kisan Unnati.
Provide:
- Current market prices
- Price trends and forecasts
- Market intelligence
- Selling strategy advice

Consider both local and national markets, seasonal variations, and quality factors.
"""
        }

    def generate_response(self,
                         message: str,
                         intent: str,
                         entities: Dict[str, Any],
                         context: Optional[Dict[str, Any]] = None) -> str:
        """
        Generate AI response using OpenAI API

        Args:
            message: User message
            intent: Classified intent
            entities: Extracted entities
            context: Conversation context

        Returns:
            Generated response string
        """

        if not self.api_key:
            return self._generate_fallback_response(intent, entities)

        try:
            # Select appropriate system prompt
            system_prompt = self._select_system_prompt(intent)

            # Build conversation context
            conversation = self._build_conversation_context(message, context)

            # Add entity information
            enhanced_prompt = self._enhance_with_entities(system_prompt, entities)

            # Make API call
            response = openai.ChatCompletion.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": enhanced_prompt},
                    *conversation
                ],
                max_tokens=self.max_tokens,
                temperature=self.temperature
            )

            return response.choices[0].message.content.strip()

        except Exception as e:
            print(f"Error generating AI response: {e}")
            return self._generate_fallback_response(intent, entities)

    def _select_system_prompt(self, intent: str) -> str:
        """Select appropriate system prompt based on intent"""
        prompt_mapping = {
            'crop_recommendation': 'crop_specialist',
            'disease_identification': 'disease_expert',
            'market_prices': 'market_analyst',
            'general_help': 'agricultural_assistant'
        }

        prompt_type = prompt_mapping.get(intent, 'agricultural_assistant')
        return self.system_prompts.get(prompt_type, self.system_prompts['agricultural_assistant'])

    def _build_conversation_context(self,
                                  current_message: str,
                                  context: Optional[Dict[str, Any]]) -> List[Dict[str, str]]:
        """Build conversation history for context"""
        conversation = []

        if context and context.get('history'):
            # Add recent conversation history (last 5 exchanges)
            history = context['history'][-10:]  # Last 10 messages
            for msg in history:
                if msg.get('role') in ['user', 'assistant']:
                    conversation.append({
                        "role": msg['role'],
                        "content": msg['content']
                    })

        # Add current message
        conversation.append({
            "role": "user",
            "content": current_message
        })

        return conversation

    def _enhance_with_entities(self, system_prompt: str, entities: Dict[str, Any]) -> str:
        """Enhance system prompt with entity information"""
        if not entities:
            return system_prompt

        entity_info = []

        if entities.get('crops'):
            entity_info.append(f"Crops mentioned: {', '.join(entities['crops'])}")

        if entities.get('locations'):
            entity_info.append(f"Locations mentioned: {', '.join(entities['locations'])}")

        if entities.get('numbers'):
            entity_info.append(f"Numbers mentioned: {', '.join(entities['numbers'])}")

        if entities.get('problems'):
            entity_info.append(f"Problems mentioned: {', '.join(entities['problems'])}")

        if entity_info:
            entity_context = "\n\nEntity Context:\n" + "\n".join(entity_info)
            return system_prompt + entity_context

        return system_prompt

    def _generate_fallback_response(self, intent: str, entities: Dict[str, Any]) -> str:
        """Generate fallback response when API is unavailable"""
        fallbacks = {
            'crop_recommendation': "I'd be happy to help you choose the best crops for your conditions. Could you tell me about your soil type, location, and the season you're planning for?",
            'disease_identification': "I can help identify plant diseases and suggest treatments. Please describe the symptoms you're seeing or upload a photo of the affected plant.",
            'weather_advice': "Weather plays a crucial role in farming success. What are the current weather conditions in your area, and what farming activity are you planning?",
            'market_prices': "Market prices are important for farming decisions. Which crop's price information are you looking for, and what's your location?",
            'general_help': "I'm here to help with all your farming needs! I can assist with crop recommendations, disease identification, weather advice, market information, and much more. What would you like to know?"
        }

        return fallbacks.get(intent, fallbacks['general_help'])

    def generate_structured_response(self,
                                   intent: str,
                                   entities: Dict[str, Any],
                                   context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Generate structured response with multiple components
        """
        if not self.api_key:
            return self._generate_structured_fallback(intent, entities)

        try:
            prompt = f"""
Based on the user's query with intent '{intent}' and entities {json.dumps(entities)},
generate a structured agricultural response in JSON format with the following fields:

{{
    "main_advice": "Primary recommendation or answer",
    "detailed_explanation": "More detailed explanation with reasoning",
    "action_steps": ["Step 1", "Step 2", "Step 3"],
    "precautions": ["Precaution 1", "Precaution 2"],
    "additional_resources": ["Resource 1", "Resource 2"],
    "follow_up_questions": ["Question 1", "Question 2"]
}}

Make the response practical, farmer-friendly, and specific to Indian agriculture context.
"""

            response = openai.ChatCompletion.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an expert agricultural assistant. Always respond with valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=800,
                temperature=0.3
            )

            response_text = response.choices[0].message.content.strip()

            # Try to parse JSON
            try:
                return json.loads(response_text)
            except json.JSONDecodeError:
                # If JSON parsing fails, return as text response
                return {
                    "main_advice": response_text,
                    "detailed_explanation": "",
                    "action_steps": [],
                    "precautions": [],
                    "additional_resources": [],
                    "follow_up_questions": []
                }

        except Exception as e:
            print(f"Error generating structured response: {e}")
            return self._generate_structured_fallback(intent, entities)

    def _generate_structured_fallback(self, intent: str, entities: Dict[str, Any]) -> Dict[str, Any]:
        """Generate structured fallback response"""
        base_responses = {
            'crop_recommendation': {
                "main_advice": "Consider local climate and soil conditions for crop selection",
                "detailed_explanation": "Different crops thrive in different conditions. Factors like rainfall, temperature, soil type, and market demand should all be considered.",
                "action_steps": [
                    "Test your soil pH and nutrient levels",
                    "Check local climate data and rainfall patterns",
                    "Research market demand for different crops",
                    "Consider your available resources and experience"
                ],
                "precautions": [
                    "Start with small plots to test new crops",
                    "Have backup irrigation plans",
                    "Monitor for pests and diseases regularly"
                ],
                "additional_resources": [
                    "Local agricultural extension office",
                    "Soil testing labs",
                    "Farmer producer organizations"
                ],
                "follow_up_questions": [
                    "What's your soil type?",
                    "How much rainfall do you get annually?",
                    "What crops have you grown successfully before?"
                ]
            }
        }

        return base_responses.get(intent, {
            "main_advice": "I'm here to help with your farming questions",
            "detailed_explanation": "Please provide more details about your specific farming needs",
            "action_steps": [],
            "precautions": [],
            "additional_resources": [],
            "follow_up_questions": ["What farming topic interests you?"]
        })

    def set_model_parameters(self, model: str = None, temperature: float = None, max_tokens: int = None):
        """Update model parameters"""
        if model:
            self.model = model
        if temperature is not None:
            self.temperature = temperature
        if max_tokens:
            self.max_tokens = max_tokens

    def get_available_models(self) -> List[str]:
        """Get list of available OpenAI models"""
        return ["gpt-3.5-turbo", "gpt-4", "gpt-4-turbo-preview"]

    def validate_api_key(self) -> bool:
        """Validate OpenAI API key"""
        if not self.api_key:
            return False

        try:
            openai.ChatCompletion.create(
                model=self.model,
                messages=[{"role": "user", "content": "test"}],
                max_tokens=5
            )
            return True
        except Exception:
            return False