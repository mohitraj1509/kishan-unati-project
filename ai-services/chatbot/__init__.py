from .intent_handler import IntentHandler
from .response_generator import ResponseGenerator
from .prompt_engine import PromptEngine
from typing import Dict, List, Any, Optional
from datetime import datetime
import json

class ChatbotHandler:
    def __init__(self):
        self.intent_handler = IntentHandler()
        self.response_generator = ResponseGenerator()
        self.prompt_engine = PromptEngine()
        self.conversation_memory = {}
        self.max_memory_length = 20

    def is_ready(self) -> bool:
        """Check if all components are ready"""
        return True  # Basic check - could be more sophisticated

    def process_message(self,
                       message: str,
                       context: Optional[Dict[str, Any]] = None,
                       user_id: Optional[str] = None) -> Dict[str, Any]:
        """
        Process a user message and generate response

        Args:
            message: User input message
            context: Additional context information
            user_id: User identifier for conversation memory

        Returns:
            Dictionary with response and metadata
        """

        try:
            # Initialize user context if needed
            if user_id and user_id not in self.conversation_memory:
                self.conversation_memory[user_id] = {
                    'history': [],
                    'last_intent': None,
                    'pending_questions': [],
                    'user_profile': {}
                }

            # Get conversation context
            user_context = self.conversation_memory.get(user_id, {'history': []})

            # Classify intent
            intent, confidence, entities = self.intent_handler.classify_intent(message)

            # Update conversation memory
            if user_id:
                self._update_memory(user_id, message, intent, entities)

            # Generate response using basic training data (always use rule-based for now)
            response = self.response_generator.generate_response(
                intent, confidence, entities, user_context
            )
            response['response_type'] = 'basic_training'
            response['entities'] = entities

            # Add conversation metadata
            response['conversation_id'] = user_id or 'anonymous'
            response['message_count'] = len(user_context.get('history', [])) + 1

            # Update context for follow-up
            if user_id:
                response['needs_follow_up'] = response.get('needs_more_info', False)
                if response.get('follow_up_question'):
                    self.conversation_memory[user_id]['pending_questions'].append(
                        response['follow_up_question']
                    )

            return response

        except Exception as e:
            print(f"Error processing message: {e}")
            return self._generate_error_response(str(e))

    def _update_memory(self, user_id: str, message: str, intent: str, entities: Dict[str, Any]):
        """Update conversation memory"""
        memory = self.conversation_memory[user_id]

        # Add message to history
        memory['history'].append({
            'role': 'user',
            'content': message,
            'timestamp': datetime.utcnow().isoformat(),
            'intent': intent,
            'entities': entities
        })

        # Update last intent
        memory['last_intent'] = intent

        # Update user profile with extracted information
        self._update_user_profile(memory['user_profile'], entities)

        # Trim history if too long
        if len(memory['history']) > self.max_memory_length:
            memory['history'] = memory['history'][-self.max_memory_length:]

    def _update_user_profile(self, profile: Dict[str, Any], entities: Dict[str, Any]):
        """Update user profile with extracted entities"""
        if entities.get('locations') and not profile.get('location'):
            profile['location'] = entities['locations'][0]

        if entities.get('crops'):
            if 'crops' not in profile:
                profile['crops'] = []
            profile['crops'].extend(entities['crops'])
            profile['crops'] = list(set(profile['crops']))  # Remove duplicates

    def _get_suggested_actions(self, intent: str, entities: Dict[str, Any]) -> List[str]:
        """Get suggested actions based on intent and entities"""
        actions = {
            'crop_recommendation': [
                'View detailed crop guide',
                'Check soil requirements',
                'Get market prices',
                'Weather-based advice'
            ],
            'disease_identification': [
                'Upload plant photo',
                'Get treatment options',
                'Prevention tips',
                'Similar cases'
            ],
            'weather_advice': [
                'Current weather check',
                'Irrigation schedule',
                'Planting calendar',
                'Weather alerts'
            ],
            'market_prices': [
                'Current prices',
                'Price trends',
                'Nearby markets',
                'Selling tips'
            ],
            'fertilizer_advice': [
                'Soil test guide',
                'Fertilizer calculator',
                'Application methods',
                'Organic alternatives'
            ],
            'pest_control': [
                'Pest identification',
                'Control methods',
                'Prevention strategies',
                'Organic solutions'
            ],
            'government_schemes': [
                'Available schemes',
                'Eligibility check',
                'Application process',
                'Scheme benefits'
            ],
            'farming_techniques': [
                'Technique guides',
                'Video tutorials',
                'Expert consultation',
                'Success stories'
            ]
        }

        return actions.get(intent, ['Get more information', 'Ask specific questions'])

    def _generate_error_response(self, error: str) -> Dict[str, Any]:
        """Generate error response"""
        return {
            'response': "I apologize, but I'm having trouble processing your request right now. Please try again or contact support if the problem persists.",
            'intent': 'error',
            'confidence': 0.0,
            'error': error,
            'timestamp': datetime.utcnow().isoformat(),
            'suggested_actions': ['Try again', 'Contact support'],
            'response_type': 'error'
        }

    def get_conversation_history(self, user_id: str) -> List[Dict[str, Any]]:
        """Get conversation history for a user"""
        if user_id in self.conversation_memory:
            return self.conversation_memory[user_id]['history']
        return []

    def clear_conversation_memory(self, user_id: str):
        """Clear conversation memory for a user"""
        if user_id in self.conversation_memory:
            self.conversation_memory[user_id] = {
                'history': [],
                'last_intent': None,
                'pending_questions': [],
                'user_profile': {}
            }

    def get_user_profile(self, user_id: str) -> Dict[str, Any]:
        """Get user profile information"""
        if user_id in self.conversation_memory:
            return self.conversation_memory[user_id]['user_profile']
        return {}

    def get_pending_questions(self, user_id: str) -> List[str]:
        """Get pending questions for a user"""
        if user_id in self.conversation_memory:
            return self.conversation_memory[user_id]['pending_questions']
        return []

    def add_to_memory(self, user_id: str, role: str, content: str, metadata: Optional[Dict[str, Any]] = None):
        """Manually add message to conversation memory"""
        if user_id not in self.conversation_memory:
            self.conversation_memory[user_id] = {
                'history': [],
                'last_intent': None,
                'pending_questions': [],
                'user_profile': {}
            }

        message = {
            'role': role,
            'content': content,
            'timestamp': datetime.utcnow().isoformat()
        }

        if metadata:
            message.update(metadata)

        self.conversation_memory[user_id]['history'].append(message)

        # Trim history
        if len(self.conversation_memory[user_id]['history']) > self.max_memory_length:
            self.conversation_memory[user_id]['history'] = self.conversation_memory[user_id]['history'][-self.max_memory_length:]

    def get_conversation_summary(self, user_id: str) -> Dict[str, Any]:
        """Get summary of conversation"""
        if user_id not in self.conversation_memory:
            return {'total_messages': 0, 'intents_discussed': [], 'main_topics': []}

        memory = self.conversation_memory[user_id]
        history = memory['history']

        intents = []
        topics = set()

        for msg in history:
            if msg.get('intent'):
                intents.append(msg['intent'])
            if msg.get('entities', {}).get('crops'):
                topics.update(msg['entities']['crops'])

        return {
            'total_messages': len(history),
            'intents_discussed': list(set(intents)),
            'main_topics': list(topics),
            'last_interaction': history[-1]['timestamp'] if history else None,
            'user_profile': memory['user_profile']
        }

    def export_conversation(self, user_id: str) -> str:
        """Export conversation as JSON string"""
        if user_id in self.conversation_memory:
            return json.dumps(self.conversation_memory[user_id], indent=2, default=str)
        return "{}"

    def import_conversation(self, user_id: str, conversation_data: str):
        """Import conversation from JSON string"""
        try:
            data = json.loads(conversation_data)
            self.conversation_memory[user_id] = data
        except json.JSONDecodeError:
            print(f"Invalid conversation data for user {user_id}")

    def get_chatbot_stats(self) -> Dict[str, Any]:
        """Get chatbot usage statistics"""
        total_users = len(self.conversation_memory)
        total_messages = sum(len(mem['history']) for mem in self.conversation_memory.values())

        intent_counts = {}
        for mem in self.conversation_memory.values():
            for msg in mem['history']:
                intent = msg.get('intent', 'unknown')
                intent_counts[intent] = intent_counts.get(intent, 0) + 1

        return {
            'total_users': total_users,
            'total_messages': total_messages,
            'average_messages_per_user': total_messages / total_users if total_users > 0 else 0,
            'intent_distribution': intent_counts,
            'memory_usage': len(self.conversation_memory)
        }