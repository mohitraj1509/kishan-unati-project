"""
Advanced Chatbot Training with Intent Recognition
Modern NLP Pipeline
"""

import json
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, Embedding, LSTM, Bidirectional
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from sklearn.preprocessing import LabelEncoder
import pickle
import os
from datetime import datetime

def load_intents(file_path='chatbot/data/intents.json'):
    """Load intent data"""
    print("📊 Loading intents...")
    
    if not os.path.exists(file_path):
        print(f"❌ Intents file not found: {file_path}")
        print("\n📝 Sample intents.json format:")
        print(json.dumps({
            "intents": [
                {
                    "tag": "greeting",
                    "patterns": ["hello", "hi", "hey"],
                    "responses": ["Hello!", "Hi there!"]
                }
            ]
        }, indent=2))
        return None
    
    with open(file_path, 'r', encoding='utf-8') as f:
        intents = json.load(f)
    
    print(f"✅ Loaded {len(intents['intents'])} intent categories")
    return intents

def prepare_training_data(intents):
    """Prepare training data from intents"""
    print("🔧 Preparing training data...")
    
    patterns = []
    labels = []
    
    for intent in intents['intents']:
        for pattern in intent['patterns']:
            patterns.append(pattern.lower())
            labels.append(intent['tag'])
    
    print(f"✅ Prepared {len(patterns)} training examples")
    return patterns, labels

def build_lstm_model(vocab_size, num_classes, max_length):
    """Build LSTM-based intent classification model"""
    print("🏗️ Building LSTM model...")
    
    model = Sequential([
        Embedding(vocab_size, 128, input_length=max_length),
        Bidirectional(LSTM(64, return_sequences=True)),
        Dropout(0.5),
        Bidirectional(LSTM(32)),
        Dropout(0.5),
        Dense(64, activation='relu'),
        Dropout(0.3),
        Dense(num_classes, activation='softmax')
    ])
    
    model.compile(
        optimizer='adam',
        loss='sparse_categorical_crossentropy',
        metrics=['accuracy']
    )
    
    print("✅ Model built successfully!")
    return model

def train_chatbot():
    """Main training function"""
    print("="*60)
    print("🤖 CHATBOT MODEL TRAINING")
    print("="*60)
    
    # Load intents
    intents = load_intents()
    if intents is None:
        return {'status': 'failed', 'reason': 'No intents data'}
    
    # Prepare data
    patterns, labels = prepare_training_data(intents)
    
    # Tokenize patterns
    tokenizer = Tokenizer(oov_token='<OOV>')
    tokenizer.fit_on_texts(patterns)
    sequences = tokenizer.texts_to_sequences(patterns)
    
    # Pad sequences
    max_length = max([len(seq) for seq in sequences])
    padded_sequences = pad_sequences(sequences, maxlen=max_length, padding='post')
    
    # Encode labels
    label_encoder = LabelEncoder()
    encoded_labels = label_encoder.fit_transform(labels)
    
    # Build model
    vocab_size = len(tokenizer.word_index) + 1
    num_classes = len(label_encoder.classes_)
    
    model = build_lstm_model(vocab_size, num_classes, max_length)
    
    print(f"\n📊 Model Summary:")
    print(f"   Vocabulary size: {vocab_size}")
    print(f"   Number of classes: {num_classes}")
    print(f"   Max sequence length: {max_length}")
    
    # Train model
    print("\n🚀 Training model...")
    history = model.fit(
        padded_sequences,
        encoded_labels,
        epochs=100,
        batch_size=16,
        validation_split=0.2,
        verbose=1,
        callbacks=[
            tf.keras.callbacks.EarlyStopping(
                monitor='val_accuracy',
                patience=10,
                restore_best_weights=True
            )
        ]
    )
    
    # Create models directory
    os.makedirs('chatbot/models', exist_ok=True)
    
    # Save model
    model_path = 'chatbot/models/chatbot_model.h5'
    model.save(model_path)
    print(f"✅ Model saved: {model_path}")
    
    # Save tokenizer
    with open('chatbot/models/tokenizer.pkl', 'wb') as f:
        pickle.dump(tokenizer, f)
    print("✅ Tokenizer saved")
    
    # Save label encoder
    with open('chatbot/models/label_encoder.pkl', 'wb') as f:
        pickle.dump(label_encoder, f)
    print("✅ Label encoder saved")
    
    # Save intents (for responses)
    with open('chatbot/models/intents.json', 'w', encoding='utf-8') as f:
        json.dump(intents, f, indent=2, ensure_ascii=False)
    print("✅ Intents saved")
    
    # Save metadata
    final_accuracy = max(history.history['val_accuracy'])
    metadata = {
        'training_date': datetime.now().isoformat(),
        'num_intents': num_classes,
        'intent_tags': list(label_encoder.classes_),
        'vocab_size': vocab_size,
        'max_length': int(max_length),
        'best_val_accuracy': float(final_accuracy),
        'total_epochs': len(history.history['loss'])
    }
    
    with open('chatbot/models/model_metadata.json', 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print("\n" + "="*60)
    print("✅ Training Complete!")
    print(f"🎯 Best Validation Accuracy: {final_accuracy:.4f}")
    print("="*60)
    
    return {
        'status': 'success',
        'accuracy': final_accuracy,
        'num_intents': num_classes
    }

if __name__ == "__main__":
    result = train_chatbot()
    print(f"\nFinal Result: {result}")
