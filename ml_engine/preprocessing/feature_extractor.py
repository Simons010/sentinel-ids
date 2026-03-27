
import pandas as pd
import numpy as np
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.base import BaseEstimator, TransformerMixin
import joblib
import os

class FeatureExtractor(BaseEstimator, TransformerMixin):
    def __init__(self):
        self.categorical_cols = ['proto', 'state', 'service']
        self.encoders = {}
        self.scaler = StandardScaler()
        self.is_fitted = False
        self.feature_columns = None

    def fit(self, X, y=None):
        """
        Fit encoders and scaler to the training data.
        """
        data = X.copy()
        
        self.feature_columns = data.columns.tolist()  # Store feature columns for later use
        
        # Fit LabelEncoders for categorical columns
        for col in self.categorical_cols:
            if col in data.columns:
                data[col] = data[col].astype(str)
                le = LabelEncoder()
                le.fit(data[col])
                self.encoders[col] = le
                # Transform temporarily to allow scaler fitting on the rest
                data[col] = le.transform(data[col])

        # Fit Scaler
        # Ensure all data is numeric
        self.scaler.fit(data)
        self.is_fitted = True
        return self

    def transform(self, X):
        """
        Transform new data using fitted encoders and scaler.
        """
        if not self.is_fitted:
            raise RuntimeError("FeatureExtractor must be fitted before transform")

        data = X.copy()
        
        data = data.reindex(columns=self.feature_columns, fill_value=0)  # Ensure same columns as training, fill missing with 0

        # Apply Label Encoding
        for col in self.categorical_cols:
            if col in data.columns and col in self.encoders:
                data[col] = data[col].astype(str)
                le = self.encoders[col]
                
                # Handle unseen labels by mapping them to a default or skipping? 
                # For LabelEncoder, it's tricky. 
                # A robust way is to replace unseen variables with a placeholder or 
                # use a more robust encoder like OrdinalEncoder with handle_unknown.
                # For this prototype, we'll try to map safely.
                
                # Fast/Simple approach: Map via dict, fill unknown with 0
                le_dict = dict(zip(le.classes_, le.transform(le.classes_)))
                data[col] = data[col].apply(lambda x: le_dict.get(x, -1)) 
                # Note: -1 might break some models defined for positive inputs, 
                # but standard scaler will handle it. 
                
                # Alternatively, if we strictly follow the script logic:
                # The script re-fits or expects consistent data. 
                # Let's stick to the script's logic where possible but safer.

        # Apply Scaler
        data_scaled = self.scaler.transform(data)
        
        # Return as DataFrame for convenience if needed, or numpy array
        return data_scaled

    def save(self, path):
        """Save the fitted extractor""" 
        joblib.dump(self, path)

    def load(self, path):
        """Load a fitted extractor"""
        loaded = joblib.load(path)
        self.__dict__.update(loaded.__dict__)
        return self
