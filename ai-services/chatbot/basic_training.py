import json
from typing import Dict, List, Any

class BasicTrainingData:
    def __init__(self):
        self.training_data = self._load_training_data()

    def _load_training_data(self) -> Dict[str, Dict[str, Any]]:
        """Load basic training data for the chatbot"""
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
                'responses': [
                    "मैं आपकी मिट्टी और मौसम के आधार पर फसल की सिफारिश कर सकता हूं। आपकी मिट्टी का प्रकार क्या है? (रेतली, दोमट, काली मिट्टी)",
                    "आपके क्षेत्र के लिए मुख्य फसलें हैं: गेहूं, धान, मक्का, कपास, गन्ना। कौन सी फसल में आप रुचि रखते हैं?",
                    "मौजूदा मौसम और आपकी मिट्टी के आधार पर मैं ये फसलें सुझाऊंगा: गेहूं, चना, सरसों। क्या आप इनके बारे में और जानना चाहेंगे?",
                    "भारतीय कृषि में मुख्य फसलें: खरीफ (बरसात), रबी (सर्दी), जायद (गर्मी)। आप किस मौसम के लिए योजना बना रहे हैं?"
                ],
                'follow_up': [
                    "आपकी मिट्टी का प्रकार क्या है?",
                    "आपका स्थान या जिला क्या है?",
                    "आप किस मौसम में बोना चाहते हैं?",
                    "आपके पास कितनी जमीन है?"
                ]
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
                'responses': [
                    "पत्तों पर धब्बे या पीला पड़ना कई कारणों से हो सकता है। कृपया प्रभावित पत्ते की स्पष्ट तस्वीर अपलोड करें।",
                    "फसल की बीमारी की पहचान के लिए मुझे पत्ते, तना या फल की तस्वीर दिखाएं। इससे सही निदान हो सकेगा।",
                    "प्लांट क्लिनिक सुविधा का उपयोग करके अपनी फसल की बीमारी की पहचान कराएं। आप किस फसल की बात कर रहे हैं?"
                ],
                'follow_up': [
                    "कौन सी फसल प्रभावित है?",
                    "कब से ये लक्षण दिख रहे हैं?",
                    "क्या आपने कोई उपचार पहले किया है?"
                ]
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
                'responses': [
                    "मौसम कृषि पर बहुत प्रभाव डालता है। वर्तमान मौसम के आधार पर सिंचाई, बुवाई और सुरक्षा के सुझाव मिल सकते हैं।",
                    "बारिश, तापमान और आर्द्रता फसल के स्वास्थ्य को प्रभावित करती है। मौजूदा मौसम की स्थिति क्या है?",
                    "मौसम आधारित कृषि निर्णय महत्वपूर्ण हैं। सिंचाई, कीटनाशक और फसल सुरक्षा के लिए मौसम की निगरानी जरूरी है।"
                ],
                'follow_up': [
                    "आपके क्षेत्र का वर्तमान तापमान क्या है?",
                    "हाल ही में बारिश हुई है? कितनी?",
                    "आपकी फसल किस अवस्था में है?",
                    "आर्द्रता का स्तर क्या है?"
                ]
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
                'responses': [
                    "फसल की कीमतें नियमित रूप से बदलती हैं। वर्तमान बाजार भाव के लिए आप किस फसल के बारे में जानना चाहते हैं?",
                    "गेहूं, धान, मक्का, कपास आदि की कीमतों के लिए स्थानीय मंडी दरें देखें। किस फसल की जानकारी चाहिए?",
                    "बाजार भाव समझने से बेहतर कृषि निर्णय ले सकते हैं। वर्तमान कीमतों और रुझानों के लिए कौन सी फसल?"
                ],
                'follow_up': [
                    "किस फसल की कीमत जाननी है?",
                    "स्थानीय मंडी या थोक दर चाहिए?",
                    "आपका स्थान क्या है?"
                ]
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
                'responses': [
                    "उर्वरक का चुनाव मिट्टी परीक्षण और फसल की जरूरत पर निर्भर करता है। आप किस फसल के लिए उर्वरक चाहते हैं?",
                    "मिट्टी में NPK (नाइट्रोजन, फास्फोरस, पोटाश) की मात्रा महत्वपूर्ण है। हाल ही में मिट्टी परीक्षण करवाया है?",
                    "जैविक और रासायनिक दोनों तरह के उर्वरक उपलब्ध हैं। आप किस प्रकार को प्राथमिकता देते हैं?"
                ],
                'follow_up': [
                    "कौन सी फसल के लिए उर्वरक?",
                    "हाल ही में मिट्टी परीक्षण हुआ है?",
                    "वर्तमान NPK स्तर क्या हैं?",
                    "जैविक या रासायनिक उर्वरक?"
                ]
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
                'responses': [
                    "कीट नियंत्रण में निवारण और उपचार दोनों महत्वपूर्ण हैं। आप किस प्रकार की कीट समस्या का सामना कर रहे हैं?",
                    "जैविक और रासायनिक दोनों तरह के कीटनाशक उपलब्ध हैं। फसल और कीट के प्रकार के आधार पर चुनाव करें।",
                    "एकीकृत कीट प्रबंधन (IPM) विधि सबसे प्रभावी है। कीट की पहचान और उचित नियंत्रण जरूरी है।"
                ],
                'follow_up': [
                    "किस प्रकार का कीट है?",
                    "कौन सी फसल प्रभावित है?",
                    "पहले कोई नियंत्रण उपाय किए?",
                    "जैविक या रासायनिक समाधान?"
                ]
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
                'responses': [
                    "सरकार कई कृषि योजनाएं चलाती है: PM Kisan, Soil Health Card, Kisan Credit Card, Pradhan Mantri Fasal Bima Yojana।",
                    "कृषि सब्सिडी, ऋण और बीमा योजनाएं किसानों की मदद करती हैं। आप किस प्रकार की सहायता चाहते हैं?",
                    "केंद्र और राज्य सरकारें किसानों के लिए कई योजनाएं चलाती हैं। आपकी पसंद का क्षेत्र क्या है?"
                ],
                'follow_up': [
                    "किस प्रकार की योजना चाहिए (सब्सिडी, ऋण, बीमा)?",
                    "फसल विशिष्ट योजनाएं?",
                    "आपका राज्य क्या है?"
                ]
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
                'responses': [
                    "आधुनिक कृषि तकनीकें: SRI (System of Rice Intensification), DSR (Direct Seeded Rice), precision farming।",
                    "जैविक कृषि में कम रासायनिक उपयोग, फसल चक्रण, और प्राकृतिक खाद का प्रयोग होता है।",
                    "टिकाऊ कृषि में मिट्टी स्वास्थ्य, जल संरक्षण और पर्यावरण संरक्षण महत्वपूर्ण हैं।"
                ],
                'follow_up': [
                    "आप किस प्रकार की तकनीक में रुचि रखते हैं?",
                    "आपकी फसल का प्रकार क्या है?",
                    "आपके पास कौन से संसाधन हैं?"
                ]
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
                'responses': [
                    "नमस्ते! मैं आपकी कृषि संबंधी मदद करने के लिए यहां हूं। आप किस विषय में सहायता चाहते हैं?",
                    "किसान उन्नति में आप मदद ले सकते हैं: फसल सिफारिश, बीमारी पहचान, मौसम सलाह, बाजार भाव, सरकारी योजनाएं।",
                    "मैं कृषि विशेषज्ञ हूं। फसल, बीमारी, उर्वरक, कीट नियंत्रण, मौसम या बाजार के बारे में पूछ सकते हैं।"
                ],
                'follow_up': [
                    "आप किस विषय में मदद चाहते हैं?",
                    "कोई विशिष्ट समस्या है?",
                    "आप किस प्रकार की जानकारी ढूंढ रहे हैं?"
                ]
            }
        }

    def get_response(self, intent: str, entities: Dict[str, Any] = None) -> Dict[str, Any]:
        """Get a response for the given intent"""
        if intent in self.training_data:
            data = self.training_data[intent]
            import random
            response = random.choice(data['responses'])
            follow_up = random.choice(data['follow_up']) if data['follow_up'] else None

            return {
                'response': response,
                'intent': intent,
                'confidence': 0.8,
                'follow_up_question': follow_up,
                'suggested_actions': self._get_suggested_actions(intent),
                'timestamp': json.dumps({'current_time': 'now'}),
                'needs_more_info': True
            }
        else:
            return self._get_fallback_response()

    def _get_suggested_actions(self, intent: str) -> List[str]:
        """Get suggested actions based on intent"""
        actions_map = {
            'crop_recommendation': ['फसल सिफारिश प्राप्त करें', 'मिट्टी परीक्षण कराएं', 'मौसम जांचें'],
            'disease_identification': ['तस्वीर अपलोड करें', 'प्लांट क्लिनिक से संपर्क करें', 'उपचार शुरू करें'],
            'weather_advice': ['मौसम पूर्वानुमान देखें', 'सिंचाई योजना बनाएं', 'फसल सुरक्षा करें'],
            'market_prices': ['मंडी दरें जांचें', 'बिक्री का समय चुनें', 'गुणवत्ता सुधारें'],
            'fertilizer_advice': ['मिट्टी परीक्षण कराएं', 'NPK जांचें', 'जैविक उर्वरक आजमाएं'],
            'pest_control': ['कीट पहचानें', 'जैविक नियंत्रण आजमाएं', 'विशेषज्ञ से सलाह लें'],
            'government_schemes': ['योग्यता जांचें', 'आवेदन करें', 'दस्तावेज तैयार करें'],
            'farming_techniques': ['प्रशिक्षण लें', 'नई तकनीक आजमाएं', 'परिणाम ट्रैक करें']
        }
        return actions_map.get(intent, ['अधिक जानकारी के लिए पूछें'])

    def _get_fallback_response(self) -> Dict[str, Any]:
        """Get fallback response when intent not recognized"""
        return {
            'response': "क्षमा करें, मैं आपकी क्वेरी को समझ नहीं सका। कृपया कृषि संबंधित प्रश्न पूछें जैसे: फसल सिफारिश, बीमारी पहचान, मौसम सलाह आदि।",
            'intent': 'unknown',
            'confidence': 0.0,
            'follow_up_question': "आप किस विषय में मदद चाहते हैं?",
            'suggested_actions': ['मुख्य विषय चुनें', 'विवरण के साथ पूछें'],
            'timestamp': json.dumps({'current_time': 'now'}),
            'needs_more_info': True
        }

    def get_all_intents(self) -> List[str]:
        """Get all available intents"""
        return list(self.training_data.keys())

    def get_examples_for_intent(self, intent: str) -> List[str]:
        """Get example questions for an intent"""
        if intent in self.training_data:
            return self.training_data[intent]['examples']
        return []