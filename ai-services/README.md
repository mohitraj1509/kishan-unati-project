# Kisan Unnati AI Services

A comprehensive AI-powered agricultural services platform providing crop recommendations, disease detection, and intelligent chatbot assistance for farmers.

## Features

### 🌾 Crop Recommendation
- AI-powered crop suggestions based on soil type, location, and weather conditions
- Soil health analysis and fertilizer recommendations
- Market insights and price predictions
- Weather-based farming advice

### 🔍 Disease Detection
- Computer vision-based plant disease identification
- Support for multiple crops (rice, wheat, maize, etc.)
- Treatment recommendations and prevention strategies
- Image quality analysis for better results

### 💬 Intelligent Chatbot
- Natural language processing for agricultural queries
- Multi-intent classification (crop advice, disease help, market info, etc.)
- Context-aware conversations with memory
- Integration with OpenAI GPT models for enhanced responses

## Installation

1. Install Python dependencies:
```bash
pip install -r requirements.txt
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your API keys
```

3. For spaCy (required for chatbot):
```bash
python -m spacy download en_core_web_sm
```

## Usage

### Starting the API Server

```bash
python api.py
```

The API will be available at `http://localhost:8000`

### API Endpoints

#### Crop Recommendation
```http
POST /crop-recommendation
Content-Type: application/json

{
    "soil_type": "loamy",
    "location": "Punjab",
    "season": "kharif",
    "temperature": 28.0,
    "rainfall": 150.0,
    "ph_level": 7.0
}
```

#### Disease Detection
```http
POST /disease-detection
Content-Type: multipart/form-data

file: [image file]
crop_type: rice
```

#### Chatbot
```http
POST /chat
Content-Type: application/json

{
    "message": "What crops should I grow in clay soil?",
    "context": {},
    "user_id": "farmer123"
}
```

## Project Structure

```
ai-services/
├── api.py                    # FastAPI application
├── requirements.txt          # Python dependencies
├── crop_recommendation/
│   ├── __init__.py
│   ├── model.py             # ML model for crop prediction
│   ├── predict.py           # Prediction interface
│   └── data/
│       └── crop_data.csv    # Training data
├── disease_detection/
│   ├── __init__.py
│   ├── cnn_model.py         # CNN model for disease detection
│   └── predict.py           # Disease prediction interface
└── chatbot/
    ├── __init__.py
    ├── intent_handler.py    # Intent classification
    ├── response_generator.py # Response generation
    └── prompt_engine.py     # OpenAI integration
```

## Configuration

### Environment Variables

- `OPENAI_API_KEY`: OpenAI API key for enhanced chatbot responses
- `PORT`: Server port (default: 8000)

### Model Training

#### Crop Recommendation Model
```python
from crop_recommendation.model import CropRecommendationModel

model = CropRecommendationModel()
model.train_model()  # Trains and saves the model
```

#### Disease Detection Model
```python
from disease_detection.cnn_model import DiseaseDetectionModel

model = DiseaseDetectionModel()
model.train_model('path/to/training/images')
```

## Dependencies

- **FastAPI**: Web framework for API
- **TensorFlow/Keras**: Deep learning for disease detection
- **scikit-learn**: Machine learning for crop recommendation
- **spaCy**: NLP processing for chatbot
- **OpenAI**: Enhanced AI responses (optional)
- **pandas/numpy**: Data processing
- **Pillow**: Image processing
- **python-multipart**: File uploads

## Development

### Running Tests
```bash
pytest tests/
```

### Code Formatting
```bash
black .
isort .
```

### API Documentation
Visit `http://localhost:8000/docs` for interactive API documentation.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Email: support@kisanunnati.com
- Documentation: https://docs.kisanunnati.com
- Issues: https://github.com/kisanunnati/ai-services/issues