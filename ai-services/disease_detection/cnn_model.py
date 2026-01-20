import tensorflow as tf
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
import numpy as np
import cv2
import os
from typing import Dict, List, Any, Tuple
import joblib

class DiseaseDetectionModel:
    def __init__(self, model_path: str = "disease_detection/models/disease_model.h5"):
        self.model_path = model_path
        self.model = None
        self.class_names = [
            'healthy', 'bacterial_blight', 'leaf_blight', 'powdery_mildew',
            'rust', 'fusarium_wilt', 'root_rot', 'aphid_damage', 'caterpillar_damage'
        ]
        self.img_size = (224, 224)
        self._build_model()

    def _build_model(self):
        """Build CNN model for disease detection"""
        try:
            if os.path.exists(self.model_path):
                self.model = load_model(self.model_path)
                print("Loaded existing disease detection model")
            else:
                self.model = Sequential([
                    Conv2D(32, (3, 3), activation='relu', input_shape=(224, 224, 3)),
                    MaxPooling2D((2, 2)),

                    Conv2D(64, (3, 3), activation='relu'),
                    MaxPooling2D((2, 2)),

                    Conv2D(128, (3, 3), activation='relu'),
                    MaxPooling2D((2, 2)),

                    Conv2D(128, (3, 3), activation='relu'),
                    MaxPooling2D((2, 2)),

                    Flatten(),
                    Dense(512, activation='relu'),
                    Dropout(0.5),
                    Dense(len(self.class_names), activation='softmax')
                ])

                self.model.compile(
                    optimizer='adam',
                    loss='categorical_crossentropy',
                    metrics=['accuracy']
                )
                print("Built new disease detection model")
        except Exception as e:
            print(f"Error building/loading model: {e}")
            self._build_fallback_model()

    def _build_fallback_model(self):
        """Build a simple fallback model"""
        self.model = Sequential([
            Conv2D(16, (3, 3), activation='relu', input_shape=(224, 224, 3)),
            MaxPooling2D((2, 2)),
            Flatten(),
            Dense(64, activation='relu'),
            Dense(len(self.class_names), activation='softmax')
        ])
        self.model.compile(
            optimizer='adam',
            loss='categorical_crossentropy',
            metrics=['accuracy']
        )

    def preprocess_image(self, image_data: bytes) -> np.ndarray:
        """Preprocess image for model prediction"""
        try:
            # Decode image
            nparr = np.frombuffer(image_data, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            if img is None:
                raise ValueError("Could not decode image")

            # Convert BGR to RGB
            img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)

            # Resize image
            img = cv2.resize(img, self.img_size)

            # Normalize pixel values
            img = img.astype(np.float32) / 255.0

            # Add batch dimension
            img = np.expand_dims(img, axis=0)

            return img

        except Exception as e:
            print(f"Error preprocessing image: {e}")
            raise

    def predict_disease(self, image_data: bytes) -> Dict[str, Any]:
        """Predict disease from image"""
        try:
            if self.model is None:
                raise Exception("Model not loaded")

            # Preprocess image
            processed_img = self.preprocess_image(image_data)

            # Make prediction
            predictions = self.model.predict(processed_img)[0]

            # Get top prediction
            predicted_class_idx = np.argmax(predictions)
            predicted_class = self.class_names[predicted_class_idx]
            confidence = float(predictions[predicted_class_idx])

            # Get disease information
            disease_info = self._get_disease_info(predicted_class)

            return {
                'disease': predicted_class,
                'confidence': confidence,
                'severity': disease_info['severity'],
                'treatment': disease_info['treatment'],
                'prevention': disease_info['prevention'],
                'all_predictions': {
                    self.class_names[i]: float(predictions[i])
                    for i in range(len(self.class_names))
                }
            }

        except Exception as e:
            print(f"Error in disease prediction: {e}")
            return self._get_fallback_prediction()

    def _get_disease_info(self, disease: str) -> Dict[str, str]:
        """Get detailed information about a disease"""
        disease_database = {
            'healthy': {
                'severity': 'None',
                'treatment': 'No treatment needed',
                'prevention': 'Continue good agricultural practices'
            },
            'bacterial_blight': {
                'severity': 'High',
                'treatment': 'Apply copper-based bactericides. Remove infected plant parts.',
                'prevention': 'Use disease-resistant varieties. Avoid overhead irrigation. Practice crop rotation.'
            },
            'leaf_blight': {
                'severity': 'Medium',
                'treatment': 'Apply fungicides like chlorothalonil or mancozeb. Improve air circulation.',
                'prevention': 'Avoid wet foliage. Use drip irrigation. Remove plant debris.'
            },
            'powdery_mildew': {
                'severity': 'Medium',
                'treatment': 'Apply sulfur or potassium bicarbonate sprays. Improve air circulation.',
                'prevention': 'Plant resistant varieties. Avoid overhead watering. Space plants properly.'
            },
            'rust': {
                'severity': 'High',
                'treatment': 'Apply fungicides containing triazoles or strobilurins.',
                'prevention': 'Use rust-resistant varieties. Remove alternate hosts. Apply preventive fungicides.'
            },
            'fusarium_wilt': {
                'severity': 'Very High',
                'treatment': 'Remove and destroy infected plants. Soil fumigation may be necessary.',
                'prevention': 'Use resistant varieties. Practice long crop rotations. Sterilize tools.'
            },
            'root_rot': {
                'severity': 'High',
                'treatment': 'Improve drainage. Apply fungicides to soil. Reduce watering.',
                'prevention': 'Ensure good drainage. Avoid overwatering. Use well-draining soil.'
            },
            'aphid_damage': {
                'severity': 'Medium',
                'treatment': 'Apply insecticidal soap or neem oil. Introduce beneficial insects.',
                'prevention': 'Monitor plants regularly. Use reflective mulches. Encourage natural predators.'
            },
            'caterpillar_damage': {
                'severity': 'Medium',
                'treatment': 'Apply Bacillus thuringiensis (Bt) or spinosad insecticides.',
                'prevention': 'Hand-pick caterpillars. Use row covers. Plant trap crops.'
            }
        }

        return disease_database.get(disease, {
            'severity': 'Unknown',
            'treatment': 'Consult local agricultural extension service',
            'prevention': 'Practice good agricultural management'
        })

    def _get_fallback_prediction(self) -> Dict[str, Any]:
        """Provide fallback prediction when model fails"""
        return {
            'disease': 'unknown',
            'confidence': 0.0,
            'severity': 'Unknown',
            'treatment': 'Please consult a local agricultural expert',
            'prevention': 'Practice good agricultural management',
            'all_predictions': {}
        }

    def train_model(self, train_data_dir: str, epochs: int = 20):
        """Train the model with new data"""
        try:
            # Data augmentation
            train_datagen = ImageDataGenerator(
                rescale=1./255,
                rotation_range=20,
                width_shift_range=0.2,
                height_shift_range=0.2,
                shear_range=0.2,
                zoom_range=0.2,
                horizontal_flip=True,
                validation_split=0.2
            )

            # Load training data
            train_generator = train_datagen.flow_from_directory(
                train_data_dir,
                target_size=self.img_size,
                batch_size=32,
                class_mode='categorical',
                subset='training'
            )

            validation_generator = train_datagen.flow_from_directory(
                train_data_dir,
                target_size=self.img_size,
                batch_size=32,
                class_mode='categorical',
                subset='validation'
            )

            # Callbacks
            early_stopping = EarlyStopping(
                monitor='val_accuracy',
                patience=5,
                restore_best_weights=True
            )

            model_checkpoint = ModelCheckpoint(
                self.model_path,
                monitor='val_accuracy',
                save_best_only=True
            )

            # Train model
            history = self.model.fit(
                train_generator,
                epochs=epochs,
                validation_data=validation_generator,
                callbacks=[early_stopping, model_checkpoint]
            )

            # Save class names
            self.class_names = list(train_generator.class_indices.keys())
            class_indices_path = self.model_path.replace('.h5', '_classes.pkl')
            joblib.dump(self.class_names, class_indices_path)

            return history.history

        except Exception as e:
            print(f"Error training model: {e}")
            return None

    def get_model_info(self) -> Dict[str, Any]:
        """Get information about the model"""
        return {
            'model_type': 'CNN',
            'input_shape': self.img_size + (3,),
            'num_classes': len(self.class_names),
            'classes': self.class_names,
            'model_path': self.model_path,
            'is_loaded': self.model is not None
        }