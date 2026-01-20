import re
import json
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime
import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class IntentHandler:
    def __init__(self):
        # Load spaCy model for NLP processing
        try:
            self.nlp = spacy.load("en_core_web_sm")
        except OSError:
            # Fallback if model not available
            import subprocess
            subprocess.run(["python", "-m", "spacy", "download", "en_core_web_sm"])
            self.nlp = spacy.load("en_core_web_sm")

        # Initialize TF-IDF vectorizer
        self.vectorizer = TfidfVectorizer(stop_words='english', ngram_range=(1, 2))
        self.intent_vectors = None

        # Define intents and their training examples
        self.intents = self._load_intents()

        # Train the vectorizer
        self._train_vectorizer()

    def _load_intents(self) -> Dict[str, Dict[str, Any]]:
        """Load intent definitions and examples"""
        return {
            'crop_recommendation': {
                'examples': [
                    'what crop should I grow',
                    'recommend crops for my soil',
                    'which crop is best for my land',
                    'suggest crops for farming',
                    'what to plant this season',
                    'crop suggestions',
                    'best crops for my area',
                    'farming recommendations'
                ],
                'keywords': ['crop', 'grow', 'plant', 'recommend', 'suggest', 'best', 'farming'],
                'response_type': 'crop_recommendation'
            },
            'disease_identification': {
                'examples': [
                    'my plant has spots on leaves',
                    'what disease is this',
                    'plant disease identification',
                    'leaves turning yellow',
                    'brown spots on leaves',
                    'identify plant disease',
                    'what is wrong with my crop',
                    'disease diagnosis'
                ],
                'keywords': ['disease', 'spots', 'yellow', 'brown', 'sick', 'identify', 'diagnosis'],
                'response_type': 'disease_detection'
            },
            'weather_advice': {
                'examples': [
                    'should I irrigate today',
                    'weather effect on crops',
                    'rain impact on farming',
                    'temperature and crops',
                    'weather advisory for farmers',
                    'farming weather tips',
                    'climate advice'
                ],
                'keywords': ['weather', 'rain', 'temperature', 'irrigate', 'climate', 'advisory'],
                'response_type': 'weather_advice'
            },
            'market_prices': {
                'examples': [
                    'current crop prices',
                    'market rates for wheat',
                    'selling price of rice',
                    'commodity prices',
                    'farm produce rates',
                    'price information',
                    'market trends'
                ],
                'keywords': ['price', 'market', 'rates', 'selling', 'commodity', 'trends'],
                'response_type': 'market_info'
            },
            'fertilizer_advice': {
                'examples': [
                    'which fertilizer to use',
                    'fertilizer recommendations',
                    'soil nutrient management',
                    'NPK requirements',
                    'organic fertilizers',
                    'chemical fertilizers',
                    'soil testing advice'
                ],
                'keywords': ['fertilizer', 'NPK', 'nutrient', 'soil', 'organic', 'chemical'],
                'response_type': 'fertilizer_advice'
            },
            'pest_control': {
                'examples': [
                    'how to control pests',
                    'insecticide recommendations',
                    'pest management',
                    'bugs on plants',
                    'organic pest control',
                    'chemical pest control',
                    'pesticide advice'
                ],
                'keywords': ['pest', 'insect', 'bug', 'control', 'pesticide', 'organic'],
                'response_type': 'pest_control'
            },
            'government_schemes': {
                'examples': [
                    'government farming schemes',
                    'subsidy for farmers',
                    'agricultural loans',
                    'PM Kisan scheme',
                    'farming subsidies',
                    'government support',
                    'farmer welfare schemes'
                ],
                'keywords': ['government', 'scheme', 'subsidy', 'loan', 'PM Kisan', 'support'],
                'response_type': 'government_schemes'
            },
            'farming_techniques': {
                'examples': [
                    'modern farming methods',
                    'organic farming techniques',
                    'sustainable agriculture',
                    'farming best practices',
                    'crop rotation advice',
                    'irrigation methods',
                    'soil conservation'
                ],
                'keywords': ['technique', 'method', 'organic', 'sustainable', 'practice', 'rotation'],
                'response_type': 'farming_techniques'
            },
            'general_help': {
                'examples': [
                    'help me with farming',
                    'agricultural assistance',
                    'farming guidance',
                    'farmer support',
                    'agricultural advice',
                    'farming information',
                    'how can you help'
                ],
                'keywords': ['help', 'assist', 'guidance', 'support', 'advice', 'information'],
                'response_type': 'general_help'
            }
        }

    def _train_vectorizer(self):
        """Train TF-IDF vectorizer with intent examples"""
        all_examples = []
        for intent_data in self.intents.values():
            all_examples.extend(intent_data['examples'])

        try:
            self.intent_vectors = self.vectorizer.fit_transform(all_examples)
        except Exception as e:
            print(f"Error training vectorizer: {e}")
            self.intent_vectors = None

    def classify_intent(self, message: str) -> Tuple[str, float, Dict[str, Any]]:
        """
        Classify the intent of a user message

        Returns:
            Tuple of (intent_name, confidence_score, extracted_entities)
        """
        try:
            # Preprocess message
            processed_message = self._preprocess_message(message)

            # Extract entities
            entities = self._extract_entities(message)

            # Method 1: Keyword matching
            keyword_intent, keyword_score = self._keyword_based_classification(processed_message)

            # Method 2: TF-IDF similarity
            tfidf_intent, tfidf_score = self._tfidf_based_classification(processed_message)

            # Method 3: Rule-based classification
            rule_intent, rule_score = self._rule_based_classification(message)

            # Combine scores (weighted average)
            intent_scores = {}
            for intent in self.intents.keys():
                scores = []
                if intent == keyword_intent:
                    scores.append(keyword_score * 0.4)
                if intent == tfidf_intent:
                    scores.append(tfidf_score * 0.4)
                if intent == rule_intent:
                    scores.append(rule_score * 0.2)

                if scores:
                    intent_scores[intent] = sum(scores) / len(scores)
                else:
                    intent_scores[intent] = 0.0

            # Get best intent
            best_intent = max(intent_scores, key=intent_scores.get)
            best_score = intent_scores[best_intent]

            # Apply threshold
            if best_score < 0.1:
                best_intent = 'general_help'
                best_score = 0.5

            return best_intent, best_score, entities

        except Exception as e:
            print(f"Error in intent classification: {e}")
            return 'general_help', 0.5, {}

    def _preprocess_message(self, message: str) -> str:
        """Preprocess message for better matching"""
        # Convert to lowercase
        message = message.lower()

        # Remove punctuation
        message = re.sub(r'[^\w\s]', ' ', message)

        # Remove extra whitespace
        message = ' '.join(message.split())

        return message

    def _keyword_based_classification(self, message: str) -> Tuple[str, float]:
        """Classify based on keyword matching"""
        max_score = 0
        best_intent = 'general_help'

        for intent_name, intent_data in self.intents.items():
            score = 0
            keywords = intent_data['keywords']

            for keyword in keywords:
                if keyword.lower() in message:
                    score += 1

            # Normalize score
            score = score / len(keywords) if keywords else 0

            if score > max_score:
                max_score = score
                best_intent = intent_name

        return best_intent, min(max_score, 1.0)

    def _tfidf_based_classification(self, message: str) -> Tuple[str, float]:
        """Classify based on TF-IDF similarity"""
        if self.intent_vectors is None:
            return 'general_help', 0.0

        try:
            message_vector = self.vectorizer.transform([message])
            similarities = cosine_similarity(message_vector, self.intent_vectors)

            # Group similarities by intent
            intent_similarities = {}
            example_count = 0

            for intent_name, intent_data in self.intents.items():
                num_examples = len(intent_data['examples'])
                intent_sims = similarities[0][example_count:example_count + num_examples]
                intent_similarities[intent_name] = np.max(intent_sims)
                example_count += num_examples

            best_intent = max(intent_similarities, key=intent_similarities.get)
            best_score = intent_similarities[best_intent]

            return best_intent, float(best_score)

        except Exception as e:
            print(f"Error in TF-IDF classification: {e}")
            return 'general_help', 0.0

    def _rule_based_classification(self, message: str) -> Tuple[str, float]:
        """Rule-based intent classification"""
        rules = {
            'crop_recommendation': [
                r'\b(what|which|best)\s+(crop|plant)s?\s+(should|to|for|can)\s+(I|we)\s+(grow|plant|cultivate)',
                r'\b(recommend|suggest)\s+(crop|plant)s?\s+(for|to)',
                r'\b(crop|plant)\s+(recommendation|suggestion)s?'
            ],
            'disease_identification': [
                r'\b(disease|problem|issue)\s+(with|in)\s+(my|plant|crop)',
                r'\b(what|identify)\s+(is|are)\s+(wrong|this)\s+(with|disease)',
                r'\b(spots?|yellow|brown|black)\s+(on|leaves?|stems?|fruits?)'
            ],
            'weather_advice': [
                r'\b(weather|rain|temperature|climate)\s+(effect|impact|advice)',
                r'\b(should|can)\s+I\s+(irrigate|water|plant)',
                r'\b(weather|rain)\s+(today|now|forecast)'
            ],
            'market_prices': [
                r'\b(price|rate|cost)\s+(of|for)\s+(crop|produce|commodity)',
                r'\b(market|selling)\s+(price|rate)s?',
                r'\b(current|today)\s+(price|rate)s?'
            ]
        }

        for intent, patterns in rules.items():
            for pattern in patterns:
                if re.search(pattern, message, re.IGNORECASE):
                    return intent, 0.8

        return 'general_help', 0.3

    def _extract_entities(self, message: str) -> Dict[str, Any]:
        """Extract entities from message using spaCy"""
        try:
            doc = self.nlp(message)

            entities = {
                'crops': [],
                'locations': [],
                'numbers': [],
                'dates': [],
                'problems': []
            }

            # Extract named entities
            for ent in doc.ents:
                if ent.label_ in ['GPE', 'LOC']:
                    entities['locations'].append(ent.text)
                elif ent.label_ == 'DATE':
                    entities['dates'].append(ent.text)

            # Extract crop names (simple keyword matching)
            crop_keywords = ['rice', 'wheat', 'maize', 'cotton', 'sugarcane', 'potato', 'tomato', 'onion', 'soybean']
            for token in doc:
                if token.text.lower() in crop_keywords:
                    entities['crops'].append(token.text)

            # Extract numbers
            for token in doc:
                if token.like_num:
                    entities['numbers'].append(token.text)

            # Extract problem indicators
            problem_keywords = ['disease', 'pest', 'problem', 'issue', 'damage', 'rot', 'blight', 'wilt']
            for token in doc:
                if token.text.lower() in problem_keywords:
                    entities['problems'].append(token.text)

            return entities

        except Exception as e:
            print(f"Error extracting entities: {e}")
            return {}

    def get_intent_examples(self, intent: str) -> List[str]:
        """Get example messages for an intent"""
        return self.intents.get(intent, {}).get('examples', [])

    def get_all_intents(self) -> List[str]:
        """Get list of all available intents"""
        return list(self.intents.keys())

    def get_intent_info(self, intent: str) -> Dict[str, Any]:
        """Get detailed information about an intent"""
        return self.intents.get(intent, {})