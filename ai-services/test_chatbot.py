import json
import random
import time

class ChatbotHandler:
    def __init__(self):
        self.responses = self._load_responses()

    def _load_responses(self):
        return {
            'crop_recommendation': {
                'keywords': ['crop', 'grow', 'plant', 'recommend', 'suggest', 'best', 'farming', 'किसान', 'फसल', 'बोना', 'उगाना'],
                'responses': [
                    "मैं आपकी मिट्टी और मौसम के आधार पर फसल की सिफारिश कर सकता हूं। आपकी मिट्टी का प्रकार क्या है? (रेतली, दोमट, काली मिट्टी)",
                    "आपके क्षेत्र के लिए मुख्य फसलें हैं: गेहूं, धान, मक्का, कपास, गन्ना। कौन सी फसल में आप रुचि रखते हैं?",
                    "मौजूदा मौसम और आपकी मिट्टी के आधार पर मैं ये फसलें सुझाऊंगा: गेहूं, चना, सरसों। क्या आप इनके बारे में और जानना चाहेंगे?",
                    "भारतीय कृषि में मुख्य फसलें: खरीफ (बरसात), रबी (सर्दी), जायद (गर्मी)। आप किस मौसम के लिए योजना बना रहे हैं?"
                ],
                'follow_up': "आपकी मिट्टी का प्रकार क्या है?",
                'actions': ['फसल सिफारिश प्राप्त करें', 'मिट्टी परीक्षण कराएं', 'मौसम जांचें']
            },
            'disease_identification': {
                'keywords': ['disease', 'spots', 'yellow', 'brown', 'sick', 'identify', 'problem', 'बीमारी', 'धब्बे', 'पीला', 'बीमार', 'पहचान'],
                'responses': [
                    "पत्तों पर धब्बे या पीला पड़ना कई कारणों से हो सकता है। कृपया प्रभावित पत्ते की स्पष्ट तस्वीर अपलोड करें।",
                    "फसल की बीमारी की पहचान के लिए मुझे पत्ते, तना या फल की तस्वीर दिखाएं। इससे सही निदान हो सकेगा।",
                    "प्लांट क्लिनिक सुविधा का उपयोग करके अपनी फसल की बीमारी की पहचान कराएं। आप किस फसल की बात कर रहे हैं?"
                ],
                'follow_up': "कौन सी फसल प्रभावित है?",
                'actions': ['तस्वीर अपलोड करें', 'प्लांट क्लिनिक से संपर्क करें', 'उपचार शुरू करें']
            },
            'weather_advice': {
                'keywords': ['weather', 'rain', 'temperature', 'irrigate', 'climate', 'मौसम', 'बारिश', 'तापमान', 'सिंचाई'],
                'responses': [
                    "मौसम कृषि पर बहुत प्रभाव डालता है। वर्तमान मौसम के आधार पर सिंचाई, बुवाई और सुरक्षा के सुझाव मिल सकते हैं।",
                    "बारिश, तापमान और आर्द्रता फसल के स्वास्थ्य को प्रभावित करती है। मौजूदा मौसम की स्थिति क्या है?",
                    "मौसम आधारित कृषि निर्णय महत्वपूर्ण हैं। सिंचाई, कीटनाशक और फसल सुरक्षा के लिए मौसम की निगरानी जरूरी है।"
                ],
                'follow_up': "आपके क्षेत्र का वर्तमान तापमान क्या है?",
                'actions': ['मौसम पूर्वानुमान देखें', 'सिंचाई योजना बनाएं', 'फसल सुरक्षा करें']
            },
            'market_prices': {
                'keywords': ['price', 'market', 'rates', 'selling', 'commodity', 'कीमत', 'बाजार', 'दर', 'बिक्री'],
                'responses': [
                    "फसल की कीमतें नियमित रूप से बदलती हैं। वर्तमान बाजार भाव के लिए आप किस फसल के बारे में जानना चाहते हैं?",
                    "गेहूं, धान, मक्का, कपास आदि की कीमतों के लिए स्थानीय मंडी दरें देखें। किस फसल की जानकारी चाहिए?",
                    "बाजार भाव समझने से बेहतर कृषि निर्णय ले सकते हैं। वर्तमान कीमतों और रुझानों के लिए कौन सी फसल?"
                ],
                'follow_up': "किस फसल की कीमत जाननी है?",
                'actions': ['मंडी दरें जांचें', 'बिक्री का समय चुनें', 'गुणवत्ता सुधारें']
            },
            'fertilizer_advice': {
                'keywords': ['fertilizer', 'NPK', 'nutrient', 'soil', 'organic', 'chemical', 'उर्वरक', 'खाद'],
                'responses': [
                    "उर्वरक का चुनाव मिट्टी परीक्षण और फसल की जरूरत पर निर्भर करता है। आप किस फसल के लिए उर्वरक चाहते हैं?",
                    "मिट्टी में NPK (नाइट्रोजन, फास्फोरस, पोटाश) की मात्रा महत्वपूर्ण है। हाल ही में मिट्टी परीक्षण करवाया है?",
                    "जैविक और रासायनिक दोनों तरह के उर्वरक उपलब्ध हैं। आप किस प्रकार को प्राथमिकता देते हैं?"
                ],
                'follow_up': "कौन सी फसल के लिए उर्वरक?",
                'actions': ['मिट्टी परीक्षण कराएं', 'NPK जांचें', 'जैविक उर्वरक आजमाएं']
            },
            'pest_control': {
                'keywords': ['pest', 'insect', 'bug', 'control', 'pesticide', 'कीट', 'किट', 'नियंत्रण'],
                'responses': [
                    "कीट नियंत्रण में निवारण और उपचार दोनों महत्वपूर्ण हैं। आप किस प्रकार की कीट समस्या का सामना कर रहे हैं?",
                    "जैविक और रासायनिक दोनों तरह के कीटनाशक उपलब्ध हैं। फसल और कीट के प्रकार के आधार पर चुनाव करें।",
                    "एकीकृत कीट प्रबंधन (IPM) विधि सबसे प्रभावी है। कीट की पहचान और उचित नियंत्रण जरूरी है।"
                ],
                'follow_up': "किस प्रकार का कीट है?",
                'actions': ['कीट पहचानें', 'जैविक नियंत्रण आजमाएं', 'विशेषज्ञ से सलाह लें']
            },
            'government_schemes': {
                'keywords': ['government', 'scheme', 'subsidy', 'loan', 'PM Kisan', 'सरकार', 'योजना', 'सब्सिडी'],
                'responses': [
                    "सरकार कई कृषि योजनाएं चलाती है: PM Kisan, Soil Health Card, Kisan Credit Card, Pradhan Mantri Fasal Bima Yojana।",
                    "कृषि सब्सिडी, ऋण और बीमा योजनाएं किसानों की मदद करती हैं। आप किस प्रकार की सहायता चाहते हैं?",
                    "केंद्र और राज्य सरकारें किसानों के लिए कई योजनाएं चलाती हैं। आपकी पसंद का क्षेत्र क्या है?"
                ],
                'follow_up': "किस प्रकार की योजना चाहिए?",
                'actions': ['योग्यता जांचें', 'आवेदन करें', 'दस्तावेज तैयार करें']
            },
            'general_help': {
                'keywords': ['help', 'assist', 'guidance', 'support', 'advice', 'मदद', 'सहायता'],
                'responses': [
                    "नमस्ते! मैं आपकी कृषि संबंधी मदद करने के लिए यहां हूं। आप किस विषय में सहायता चाहते हैं?",
                    "किसान उन्नति में आप मदद ले सकते हैं: फसल सिफारिश, बीमारी पहचान, मौसम सलाह, बाजार भाव, सरकारी योजनाएं।",
                    "मैं कृषि विशेषज्ञ हूं। फसल, बीमारी, उर्वरक, कीट नियंत्रण, मौसम या बाजार के बारे में पूछ सकते हैं।"
                ],
                'follow_up': "आप किस विषय में मदद चाहते हैं?",
                'actions': ['मुख्य विषय चुनें', 'विवरण के साथ पूछें']
            }
        }

    def classify_intent(self, message: str) -> tuple:
        """Simple keyword-based intent classification"""
        message_lower = message.lower()

        for intent, data in self.responses.items():
            for keyword in data['keywords']:
                if keyword.lower() in message_lower:
                    return intent, 0.8

        return 'general_help', 0.5

    def generate_response(self, message: str, user_id: str = None) -> dict:
        """Generate response for user message"""
        intent, confidence = self.classify_intent(message)

        if intent in self.responses:
            data = self.responses[intent]
            response_text = random.choice(data['responses'])
            follow_up = data['follow_up']
            actions = data['actions']
        else:
            response_text = "क्षमा करें, मैं आपकी क्वेरी को समझ नहीं सका। कृपया कृषि संबंधित प्रश्न पूछें।"
            follow_up = "आप किस विषय में मदद चाहते हैं?"
            actions = ['मुख्य विषय चुनें', 'विवरण के साथ पूछें']

        return {
            'response': response_text,
            'intent': intent,
            'confidence': confidence,
            'suggested_actions': actions,
            'follow_up_question': follow_up,
            'timestamp': time.strftime('%Y-%m-%dT%H:%M:%SZ', time.gmtime())
        }

# Test the chatbot
if __name__ == '__main__':
    chatbot = ChatbotHandler()

    # Test messages
    test_messages = [
        "what crops should I grow",
        "my plants have yellow leaves",
        "how does weather affect farming",
        "what are the current market prices",
        "which fertilizer should I use",
        "how to control pests",
        "tell me about government schemes",
        "help me with farming"
    ]

    print("Testing Kisan Unnati Chatbot...")
    print("=" * 50)

    for message in test_messages:
        print(f"\nUser: {message}")
        response = chatbot.generate_response(message)
        print(f"Bot: {response['response']}")
        print(f"Intent: {response['intent']} (confidence: {response['confidence']})")
        print(f"Follow-up: {response['follow_up_question']}")
        print("-" * 30)

    print("\nChatbot testing completed!")