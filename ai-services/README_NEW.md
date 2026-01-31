# 🤖 AI Services - Kisan Unnati

**Fully Modern & Production-Ready AI/ML Microservices**

## 🚀 Features

- **Crop Recommendation** - Advanced ML with XGBoost/Random Forest + Feature Engineering
- **Disease Detection** - CNN with Transfer Learning (EfficientNetB0)
- **Intelligent Chatbot** - Bidirectional LSTM for intent recognition
- **Modern API** - FastAPI with async support
- **Auto-Training Pipeline** - One-command training for all models

---

## 📋 Quick Start

### 1. Install Dependencies
```bash
cd ai-services
pip install -r requirements.txt
```

### 2. Generate Sample Data (for testing)
```bash
python generate_sample_data.py
```

### 3. Train Models
```bash
# Train all models at once
python train_all_models.py

# Or train individually
python train_crop_model.py
python train_disease_model.py  
python train_chatbot.py
```

### 4. Start API Server
```bash
python modern_api.py
# Server: http://localhost:8000
# Docs: http://localhost:8000/docs
```

---

## 📊 API Endpoints

### Health Check
```http
GET /health
```

### Crop Recommendation
```http
POST /api/crop/recommend
Content-Type: application/json

{
  "N": 90,
  "P": 42,
  "K": 43,
  "temperature": 20.8,
  "humidity": 82.0,
  "ph": 6.5,
  "rainfall": 202.9
}
```

### Disease Detection
```http
POST /api/disease/detect
Content-Type: multipart/form-data

file: [plant_image.jpg]
```

### Chatbot
```http
POST /api/chatbot/message
Content-Type: application/json

{
  "message": "What fertilizer should I use for wheat?",
  "user_id": "user123"
}
```

---

## 🎯 Model Architecture

### Crop Recommendation
- **Algorithms**: XGBoost / Random Forest / Gradient Boosting
- **Features**: 10 (7 direct + 3 engineered)
- **Cross-validation**: 5-fold
- **Expected Accuracy**: 95%+

### Disease Detection
- **Base Model**: EfficientNetB0 (ImageNet pre-trained)
- **Training Strategy**: 2-phase (frozen base + fine-tuning)
- **Data Augmentation**: Rotation, flip, zoom, shift
- **Expected Accuracy**: 90%+

### Chatbot
- **Architecture**: Bidirectional LSTM
- **Layers**: Embedding → BiLSTM(64) → BiLSTM(32) → Dense
- **Dropout**: 0.5, 0.3 for regularization
- **Expected Accuracy**: 85%+

---

## 📁 Project Structure

```
ai-services/
├── crop_recommendation/
│   ├── models/              # Trained models
│   ├── data/               # Training data (CSV)
│   └── model.py            # Model definition
├── disease_detection/
│   ├── models/             # Trained models (.h5)
│   ├── data/
│   │   ├── train/          # Training images
│   │   └── validation/     # Validation images
│   └── cnn_model.py        # CNN definition
├── chatbot/
│   ├── models/             # Trained models
│   ├── data/               # Intents JSON
│   └── basic_training.py
├── train_all_models.py     # Complete training pipeline
├── train_crop_model.py     # Individual crop trainer
├── train_disease_model.py  # Individual disease trainer
├── train_chatbot.py        # Individual chatbot trainer
├── modern_api.py           # Production FastAPI server
├── generate_sample_data.py # Sample data generator
├── DATA_REQUIREMENTS.md    # Detailed data specifications
└── requirements.txt
```

---

## 📊 Data Requirements

### Crop Data (CSV)
**Location**: `crop_recommendation/data/crop_data.csv`

**Columns**: N, P, K, temperature, humidity, ph, rainfall, label

**Minimum**: 2000+ rows (more is better)

### Disease Images
**Location**: `disease_detection/data/train/` and `validation/`

**Structure**:
```
data/
├── train/
│   ├── healthy/           (500+ images)
│   ├── bacterial_blight/  (500+ images)
│   └── ...
└── validation/
    └── (same structure, 100+ images per class)
```

**Format**: JPG/PNG, 224x224 (auto-resized)

### Chatbot Intents (JSON)
**Location**: `chatbot/data/intents.json`

**Format**: See `generate_sample_data.py` for structure

**Minimum**: 50+ intent categories

📖 **Detailed specifications**: See `DATA_REQUIREMENTS.md`

---

## 🔧 Advanced Usage

### Custom Training Parameters

Edit training scripts to adjust:
- Learning rates
- Batch sizes  
- Model architecture
- Augmentation strategies
- Cross-validation folds

### Model Monitoring

Check these files after training:
- `training.log` - Detailed training logs
- `training_report.json` - Summary of all models
- `*/models/model_metadata.json` - Individual model stats

### Backend Integration

Already integrated at:
```
backend/src/controllers/ai.controller.js
```

API calls routed through Node.js backend for security and caching.

---

## 📈 Performance Optimization

### For Better Accuracy:
1. ✅ Use more training data (2000+ samples minimum)
2. ✅ Balance dataset classes (equal samples per class)
3. ✅ Regular retraining (quarterly recommended)
4. ✅ Use real-world data, not synthetic

### For Faster Inference:
1. ⚡ Use GPU for training/inference
2. ⚡ Batch predictions when possible
3. ⚡ Cache frequent requests
4. ⚡ Model quantization for production

### For Production Deployment:
1. 🚀 Use Docker containers
2. 🚀 Load balancing with multiple instances
3. 🚀 Model versioning and A/B testing
4. 🚀 Monitoring and logging

---

## 🐛 Troubleshooting

### Models not loading?
- ✅ Check if model files exist in `*/models/` folders
- ✅ Run training scripts first
- ✅ Check file permissions

### Low accuracy?
- ✅ Need more training data
- ✅ Check data quality and balance
- ✅ Increase training epochs
- ✅ Try different model architectures

### API errors?
- ✅ Verify model files are present
- ✅ Check input format matches API specs
- ✅ Review console logs
- ✅ Check `training.log` for training issues

### Out of memory?
- ✅ Reduce batch size
- ✅ Use smaller image sizes
- ✅ Enable GPU memory growth
- ✅ Process data in chunks

---

## 📦 Dependencies

Core packages:
- `fastapi` - Modern API framework
- `tensorflow` - Deep learning
- `scikit-learn` - Traditional ML
- `xgboost` - Gradient boosting
- `pandas` - Data manipulation
- `numpy` - Numerical computing
- `opencv-python` - Image processing
- `pillow` - Image handling
- `uvicorn` - ASGI server

Install all: `pip install -r requirements.txt`

---

## 🎓 Model Details

### Crop Recommendation Pipeline
1. Load and clean data
2. Feature engineering (NPK ratio, temp-humidity index)
3. Train multiple models (RF, GB, XGB)
4. Cross-validation
5. Select best performing model
6. Save with metadata

### Disease Detection Pipeline
1. Load and augment images
2. Transfer learning with EfficientNetB0
3. Phase 1: Train with frozen base (20 epochs)
4. Phase 2: Fine-tune top layers (30 epochs)
5. Early stopping and checkpoint
6. Save best model

### Chatbot Pipeline
1. Load intents from JSON
2. Tokenize text patterns
3. Train BiLSTM with embeddings
4. Intent classification
5. Response generation
6. Save tokenizer and model

---

## 📞 Support & Documentation

- **Data Format**: `DATA_REQUIREMENTS.md`
- **Training Logs**: `training.log`
- **Training Results**: `training_report.json`
- **API Docs**: http://localhost:8000/docs (when running)

---

## 🔄 Continuous Improvement

1. **Collect Production Data**: Save predictions for retraining
2. **Monitor Performance**: Track accuracy over time
3. **Regular Updates**: Retrain quarterly with new data
4. **User Feedback**: Incorporate farmer feedback
5. **Model Versioning**: Keep track of model versions

---

## ⚡ Quick Commands

```bash
# Generate sample data
python generate_sample_data.py

# Train all models
python train_all_models.py

# Start API
python modern_api.py

# Test crop recommendation
curl -X POST http://localhost:8000/api/crop/recommend \
  -H "Content-Type: application/json" \
  -d '{"N":90,"P":42,"K":43,"temperature":20.8,"humidity":82.0,"ph":6.5,"rainfall":202.9}'

# View logs
tail -f training.log
```

---

**Built with ❤️ for Indian Farmers** 🌾
