"""
Advanced Crop Recommendation Model Trainer
Modern ML Pipeline with Feature Engineering
"""

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.preprocessing import LabelEncoder, StandardScaler
from sklearn.model_selection import train_test_split, cross_val_score, GridSearchCV
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import xgboost as xgb
import joblib
import os
from datetime import datetime
import json

def load_and_prepare_data(data_path='crop_recommendation/data/crop_data.csv'):
    """Load and prepare crop data"""
    print("📊 Loading crop data...")
    
    if not os.path.exists(data_path):
        print(f"❌ Data file not found: {data_path}")
        print("\n📝 Sample data format needed:")
        print("N,P,K,temperature,humidity,ph,rainfall,label")
        print("90,42,43,20.8,82.0,6.5,202.9,rice")
        return None, None, None, None
    
    df = pd.read_csv(data_path)
    print(f"✅ Loaded {len(df)} samples with {len(df['label'].unique())} crop types")
    
    # Feature engineering
    df['NPK_ratio'] = df['N'] / (df['P'] + df['K'] + 1)
    df['temp_humidity_index'] = df['temperature'] * df['humidity'] / 100
    df['soil_fertility'] = (df['N'] + df['P'] + df['K']) / 3
    
    # Features and target
    feature_columns = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall',
                      'NPK_ratio', 'temp_humidity_index', 'soil_fertility']
    
    X = df[feature_columns]
    y = df['label']
    
    return X, y, feature_columns, df['label'].unique()

def train_multiple_models(X_train, X_test, y_train, y_test, label_encoder):
    """Train and compare multiple models"""
    print("\n🔧 Training multiple models...")
    
    models = {
        'Random Forest': RandomForestClassifier(
            n_estimators=200,
            max_depth=15,
            min_samples_split=5,
            min_samples_leaf=2,
            random_state=42,
            n_jobs=-1
        ),
        'Gradient Boosting': GradientBoostingClassifier(
            n_estimators=150,
            max_depth=5,
            learning_rate=0.1,
            random_state=42
        ),
        'XGBoost': xgb.XGBClassifier(
            n_estimators=200,
            max_depth=8,
            learning_rate=0.1,
            random_state=42
        )
    }
    
    results = {}
    best_model = None
    best_accuracy = 0
    
    for name, model in models.items():
        print(f"\n📈 Training {name}...")
        model.fit(X_train, y_train)
        
        # Predictions
        y_pred = model.predict(X_test)
        accuracy = accuracy_score(y_test, y_pred)
        
        # Cross-validation
        cv_scores = cross_val_score(model, X_train, y_train, cv=5)
        
        results[name] = {
            'accuracy': accuracy,
            'cv_mean': cv_scores.mean(),
            'cv_std': cv_scores.std()
        }
        
        print(f"   Accuracy: {accuracy:.4f}")
        print(f"   CV Score: {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})")
        
        if accuracy > best_accuracy:
            best_accuracy = accuracy
            best_model = (name, model)
    
    return best_model, results

def save_model(model, scaler, label_encoder, feature_columns, crop_names, 
               model_name, results):
    """Save trained model and metadata"""
    print("\n💾 Saving model...")
    
    os.makedirs('crop_recommendation/models', exist_ok=True)
    
    # Save model artifacts
    model_data = {
        'model': model,
        'scaler': scaler,
        'label_encoder': label_encoder,
        'feature_columns': feature_columns,
        'crop_names': list(crop_names),
        'model_type': model_name
    }
    
    joblib.dump(model_data, 'crop_recommendation/models/crop_model.pkl')
    
    # Save metadata
    metadata = {
        'training_date': datetime.now().isoformat(),
        'model_type': model_name,
        'num_crops': len(crop_names),
        'crop_names': list(crop_names),
        'feature_columns': feature_columns,
        'performance': results
    }
    
    with open('crop_recommendation/models/model_metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print("✅ Model saved successfully!")

def train_crop_recommendation_model():
    """Main training function"""
    print("="*60)
    print("🌾 CROP RECOMMENDATION MODEL TRAINING")
    print("="*60)
    
    # Load data
    X, y, feature_columns, crop_names = load_and_prepare_data()
    
    if X is None:
        return {'status': 'failed', 'reason': 'No data available'}
    
    # Encode labels
    label_encoder = LabelEncoder()
    y_encoded = label_encoder.fit_transform(y)
    
    # Scale features
    scaler = StandardScaler()
    X_scaled = scaler.fit_transform(X)
    
    # Split data
    X_train, X_test, y_train, y_test = train_test_split(
        X_scaled, y_encoded, test_size=0.2, random_state=42, stratify=y_encoded
    )
    
    print(f"\n📊 Dataset split:")
    print(f"   Training: {len(X_train)} samples")
    print(f"   Testing: {len(X_test)} samples")
    
    # Train models
    best_model, results = train_multiple_models(
        X_train, X_test, y_train, y_test, label_encoder
    )
    
    model_name, model = best_model
    
    print(f"\n🏆 Best Model: {model_name}")
    print(f"   Accuracy: {results[model_name]['accuracy']:.4f}")
    
    # Save model
    save_model(model, scaler, label_encoder, feature_columns, 
               crop_names, model_name, results)
    
    # Feature importance
    if hasattr(model, 'feature_importances_'):
        print("\n📊 Feature Importance:")
        importances = model.feature_importances_
        for feature, importance in sorted(zip(feature_columns, importances), 
                                        key=lambda x: x[1], reverse=True)[:5]:
            print(f"   {feature}: {importance:.4f}")
    
    print("\n" + "="*60)
    print("✅ Training Complete!")
    print("="*60)
    
    return {
        'status': 'success',
        'accuracy': results[model_name]['accuracy'],
        'model_type': model_name
    }

if __name__ == "__main__":
    result = train_crop_recommendation_model()
    print(f"\nFinal Result: {result}")
