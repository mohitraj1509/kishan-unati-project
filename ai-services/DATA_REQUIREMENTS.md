# AI Services - Data Requirements & Training Guide

## 🎯 Kya Data Chahiye

### 1. **Crop Recommendation Model**
**File Format:** CSV
**Location:** `ai-services/crop_recommendation/data/crop_data.csv`

**Required Columns:**
- `N` (Nitrogen content) - 0-140 range
- `P` (Phosphorus content) - 0-145 range  
- `K` (Potassium content) - 0-205 range
- `temperature` (°C) - 8-44 range
- `humidity` (%) - 14-100 range
- `ph` - 3.5-9.9 range
- `rainfall` (mm) - 20-300 range
- `label` (crop name) - rice, wheat, maize, etc.

**Sample CSV Structure:**
```csv
N,P,K,temperature,humidity,ph,rainfall,label
90,42,43,20.8,82.0,6.5,202.9,rice
85,58,41,21.8,80.3,7.0,wheat
60,55,44,23.6,70.3,7.0,mungbean
```

**Minimum Rows:** 2000+ (more is better)

---

### 2. **Disease Detection Model**
**File Format:** Images (JPG/PNG)
**Location:** `ai-services/disease_detection/data/train/`

**Required Folder Structure:**
```
disease_detection/data/
├── train/
│   ├── healthy/           (500+ images)
│   ├── bacterial_blight/  (500+ images)
│   ├── leaf_blight/       (500+ images)
│   ├── powdery_mildew/    (500+ images)
│   ├── rust/              (500+ images)
│   ├── fusarium_wilt/     (500+ images)
│   ├── root_rot/          (500+ images)
│   ├── aphid_damage/      (500+ images)
│   └── caterpillar_damage/(500+ images)
├── validation/
│   └── (same structure, 100+ images per class)
└── test/
    └── (same structure, 100+ images per class)
```

**Image Requirements:**
- Size: 224x224 pixels (automatically resized)
- Format: JPG or PNG
- Quality: Clear, focused plant images
- Diversity: Different angles, lighting conditions

---

### 3. **Chatbot Training**
**File Format:** JSON
**Location:** `ai-services/chatbot/data/intents.json`

**Required Structure:**
```json
{
  "intents": [
    {
      "tag": "greeting",
      "patterns": ["hello", "hi", "hey", "namaste"],
      "responses": ["Hello! How can I help you today?", "Hi there!"]
    },
    {
      "tag": "crop_info",
      "patterns": ["tell me about wheat", "wheat information"],
      "responses": ["Wheat is a cereal crop..."]
    }
  ]
}
```

**Minimum Intents:** 50+ categories

---

## 🚀 Training Commands

### Auto Train All Models:
```bash
cd ai-services
python train_all_models.py
```

### Train Individual Models:
```bash
# Crop Recommendation
python train_crop_model.py

# Disease Detection  
python train_disease_model.py

# Chatbot
python train_chatbot.py
```

---

## 📊 Where to Get Data

### Crop Recommendation Data:
- Kaggle: "Crop Recommendation Dataset"
- UCI Machine Learning Repository
- Agricultural Research Papers

### Disease Detection Images:
- PlantVillage Dataset
- Kaggle Plant Disease Datasets
- Your own field photos

### Chatbot Intents:
- Agriculture FAQ websites
- Farmer helpline transcripts
- Expert agricultural knowledge

---

## ✅ Data Quality Checklist

- [ ] No missing values
- [ ] Balanced classes (similar number of samples per category)
- [ ] Clean data (no corrupted images/invalid values)
- [ ] Proper labeling
- [ ] Diverse samples
- [ ] Train/Validation/Test split (70/15/15)

---

## 🎯 Expected Performance

After training with good data:
- **Crop Recommendation:** 95%+ accuracy
- **Disease Detection:** 90%+ accuracy  
- **Chatbot:** 85%+ intent recognition

---

## 📝 Notes

1. More data = Better performance
2. Keep data updated with new diseases/crops
3. Retrain models quarterly for best results
4. Backup trained models regularly
