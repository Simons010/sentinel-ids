import joblib
import os
import pandas as pd
import numpy as np
from django.conf import settings

from ml_engine.preprocessing.cleaner import DataCleaner
from ml_engine.preprocessing.feature_builder import FeatureBuilder
 
class MLDetector:
    def __init__(self, model_path, extractor_path):
        self.model_path = model_path
        self.extractor_path = extractor_path
        self.model = None
        self.extractor = None
        self.cleaner = DataCleaner()
        self.builder = FeatureBuilder()  # For building features from raw logs
        
    def load_model(self):
        """Load the trained model and feature extractor."""
        if not os.path.exists(self.model_path):
            raise FileNotFoundError(f"Model not found at {self.model_path}")
        
        self.model = joblib.load(self.model_path)
        
        if not os.path.exists(self.extractor_path):
            raise FileNotFoundError(f"Feature Extractor not found at {self.extractor_path}")
            
        self.extractor = joblib.load(self.extractor_path)
        print("Model and Extractor loaded successfully. \n")

    def predict(self, log_data):
        """
        Predict if a log entry (or batch) is an anomaly.
        log_data: dict (single entry) or list of dicts or DataFrame
        """
        if self.model is None:
            self.load_model()

        # Convert to DataFrame
        if isinstance(log_data, dict):
            df = pd.DataFrame([log_data])
        elif isinstance(log_data, list):
            df = pd.DataFrame(log_data)
        elif isinstance(log_data, pd.DataFrame):
            df = log_data
        else:
            raise ValueError("Unsupported data format")

        # build features
        df = self.builder.build(log_data)
        
        # Clean
        df_clean = self.cleaner.clean(df)

        # Transform
        try:
            X_processed = self.extractor.transform(df_clean)
        except Exception as e:
            print(f"Error during feature extraction: {e}")
            # Fallback or re-raise
            raise e

        # Predict
        prediction = self.model.predict(X_processed)
        probabilities = self.model.predict_proba(X_processed)
        
        # Return formatted results
        results = []
        for i, pred in enumerate(prediction):
            results.append({
                'is_anomaly': bool(pred == 1), # Assuming 1 is Attack, 0 is Normal
                'confidence': float(np.max(probabilities[i])),
                'label': 'Attack' if pred == 1 else 'Normal'
            })
            
        return results if len(results) > 1 else results[0]
