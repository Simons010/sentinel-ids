import joblib
import os
import pandas as pd
import numpy as np
from django.conf import settings

from ml_engine.preprocessing.cleaner import DataCleaner
from ml_engine.preprocessing.feature_builder import FeatureBuilder
from ml_engine.normalization.normalizer import LogNormalizer
 
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
    
        print("log data:", log_data)
        
        if isinstance(log_data, list):
            normalized_logs = log_data
        elif isinstance(log_data, dict):
            normalized_logs = [log_data]
        elif isinstance(log_data, pd.DataFrame):
            normalized_logs = log_data.to_dict(orient='records')
        else:
            raise ValueError("Unsupported log_data format. Must be str, dict, list of dicts, or DataFrame.")
        
        # build features
        dfs = []
        for log in normalized_logs:
            # print("Normalized logs:", normalized_logs)
            
            df = self.builder.build(log)
            
            if df is None:
                print("FeatureBuilder returned None for log:", log)
                continue
            dfs.append(df)
        
        if len(dfs) == 0:
            raise ValueError("No valid features generated from logs")
        
        df = pd.concat(dfs, ignore_index=True)
        
        # Clean
        df_clean = self.cleaner.clean(df)
        if df_clean is None or len(df_clean) == 0:
            raise ValueError("Cleaner returned empty dataset")

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
            
        return results 
