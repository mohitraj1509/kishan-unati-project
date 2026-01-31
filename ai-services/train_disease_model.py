"""
Advanced Disease Detection Model Trainer
Modern CNN with Transfer Learning
"""

import tensorflow as tf
from tensorflow.keras.applications import MobileNetV2, EfficientNetB0
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D, Dropout
from tensorflow.keras.models import Model
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint, ReduceLROnPlateau
from tensorflow.keras.optimizers import Adam
import os
from datetime import datetime
import json
import numpy as np

def create_data_generators(train_dir, val_dir, img_size=(224, 224), batch_size=32):
    """Create data generators with augmentation"""
    print("📊 Creating data generators...")
    
    # Training data augmentation
    train_datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=40,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        vertical_flip=True,
        fill_mode='nearest'
    )
    
    # Validation data (only rescaling)
    val_datagen = ImageDataGenerator(rescale=1./255)
    
    # Load training data
    train_generator = train_datagen.flow_from_directory(
        train_dir,
        target_size=img_size,
        batch_size=batch_size,
        class_mode='categorical',
        shuffle=True
    )
    
    # Load validation data
    val_generator = val_datagen.flow_from_directory(
        val_dir,
        target_size=img_size,
        batch_size=batch_size,
        class_mode='categorical',
        shuffle=False
    )
    
    print(f"✅ Training samples: {train_generator.samples}")
    print(f"✅ Validation samples: {val_generator.samples}")
    print(f"✅ Classes: {list(train_generator.class_indices.keys())}")
    
    return train_generator, val_generator

def build_transfer_learning_model(num_classes, img_size=(224, 224)):
    """Build model with transfer learning"""
    print("🏗️ Building model with transfer learning...")
    
    # Load pre-trained base model
    base_model = EfficientNetB0(
        input_shape=(*img_size, 3),
        include_top=False,
        weights='imagenet'
    )
    
    # Freeze base model layers
    base_model.trainable = False
    
    # Add custom layers
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(512, activation='relu')(x)
    x = Dropout(0.5)(x)
    x = Dense(256, activation='relu')(x)
    x = Dropout(0.3)(x)
    predictions = Dense(num_classes, activation='softmax')(x)
    
    # Create model
    model = Model(inputs=base_model.input, outputs=predictions)
    
    # Compile model
    model.compile(
        optimizer=Adam(learning_rate=0.001),
        loss='categorical_crossentropy',
        metrics=['accuracy', tf.keras.metrics.Precision(), tf.keras.metrics.Recall()]
    )
    
    print("✅ Model built successfully!")
    return model, base_model

def train_disease_detection():
    """Main training function"""
    print("="*60)
    print("🔬 DISEASE DETECTION MODEL TRAINING")
    print("="*60)
    
    # Paths
    train_dir = 'disease_detection/data/train'
    val_dir = 'disease_detection/data/validation'
    model_dir = 'disease_detection/models'
    
    # Check if data exists
    if not os.path.exists(train_dir):
        print(f"❌ Training data not found: {train_dir}")
        print("\n📝 Required folder structure:")
        print("disease_detection/data/")
        print("├── train/")
        print("│   ├── healthy/")
        print("│   ├── bacterial_blight/")
        print("│   └── ... (other disease classes)")
        print("└── validation/")
        print("    └── (same structure)")
        return {'status': 'failed', 'reason': 'No training data'}
    
    # Create generators
    train_gen, val_gen = create_data_generators(train_dir, val_dir)
    
    # Build model
    num_classes = len(train_gen.class_indices)
    model, base_model = build_transfer_learning_model(num_classes)
    
    # Create model directory
    os.makedirs(model_dir, exist_ok=True)
    
    # Callbacks
    callbacks = [
        EarlyStopping(
            monitor='val_accuracy',
            patience=10,
            restore_best_weights=True,
            verbose=1
        ),
        ModelCheckpoint(
            os.path.join(model_dir, 'disease_model_best.h5'),
            monitor='val_accuracy',
            save_best_only=True,
            verbose=1
        ),
        ReduceLROnPlateau(
            monitor='val_loss',
            factor=0.5,
            patience=5,
            min_lr=1e-7,
            verbose=1
        )
    ]
    
    # Train model - Phase 1 (Frozen base)
    print("\n🚀 Phase 1: Training with frozen base model...")
    history1 = model.fit(
        train_gen,
        validation_data=val_gen,
        epochs=20,
        callbacks=callbacks,
        verbose=1
    )
    
    # Fine-tuning - Phase 2 (Unfreeze some layers)
    print("\n🚀 Phase 2: Fine-tuning...")
    base_model.trainable = True
    
    # Freeze first 100 layers
    for layer in base_model.layers[:100]:
        layer.trainable = False
    
    # Recompile with lower learning rate
    model.compile(
        optimizer=Adam(learning_rate=0.0001),
        loss='categorical_crossentropy',
        metrics=['accuracy', tf.keras.metrics.Precision(), tf.keras.metrics.Recall()]
    )
    
    # Continue training
    history2 = model.fit(
        train_gen,
        validation_data=val_gen,
        epochs=30,
        callbacks=callbacks,
        initial_epoch=len(history1.history['loss']),
        verbose=1
    )
    
    # Save final model
    final_model_path = os.path.join(model_dir, 'disease_model.h5')
    model.save(final_model_path)
    print(f"✅ Final model saved: {final_model_path}")
    
    # Save class indices
    class_indices = {v: k for k, v in train_gen.class_indices.items()}
    with open(os.path.join(model_dir, 'class_indices.json'), 'w') as f:
        json.dump(class_indices, f, indent=2)
    
    # Save metadata
    final_accuracy = max(history2.history['val_accuracy'])
    metadata = {
        'training_date': datetime.now().isoformat(),
        'num_classes': num_classes,
        'class_names': list(train_gen.class_indices.keys()),
        'best_val_accuracy': float(final_accuracy),
        'total_epochs': len(history1.history['loss']) + len(history2.history['loss']),
        'img_size': [224, 224],
        'base_model': 'EfficientNetB0'
    }
    
    with open(os.path.join(model_dir, 'model_metadata.json'), 'w') as f:
        json.dump(metadata, f, indent=2)
    
    print("\n" + "="*60)
    print("✅ Training Complete!")
    print(f"🎯 Best Validation Accuracy: {final_accuracy:.4f}")
    print("="*60)
    
    return {
        'status': 'success',
        'accuracy': final_accuracy,
        'num_classes': num_classes
    }

if __name__ == "__main__":
    result = train_disease_detection()
    print(f"\nFinal Result: {result}")
