
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib
import os
import sys

# Add project root to path to import ml_engine modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from ml_engine.preprocessing.cleaner import DataCleaner
from ml_engine.preprocessing.feature_extractor import FeatureExtractor

def train_initial_model(data_path, model_save_path):
    """
    Train a Random Forest model and save it along with preprocessing artifacts.
    """
    print(f"Loading dataset from {data_path}...")
    try:
        df = pd.read_csv(data_path)
    except FileNotFoundError:
        print(f"Error: Dataset not found at {data_path}")
        return

    # 1. Cleaning
    print("Cleaning data...")
    cleaner = DataCleaner()
    df_clean = cleaner.clean(df)

    # Separate features and target
    if 'label' in df_clean.columns:
        X = df_clean.drop('label', axis=1)
        y = df_clean['label']
    else:
        print("Error: 'label' column not found in dataset")
        return

    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.3, random_state=42, stratify=y
    )

    # 2. Feature Extraction (Encoding + Scaling)
    print("Extracting features...")
    extractor = FeatureExtractor()
    X_train_processed = extractor.fit(X_train).transform(X_train)
    X_test_processed = extractor.transform(X_test)
    
    # Save Feature Extractor
    extractor_path = os.path.join(os.path.dirname(model_save_path), 'feature_extractor.pkl')
    extractor.save(extractor_path)
    print(f"Feature Extractor saved to {extractor_path}")

    # 3. Training
    print("Training Random Forest Classifier...")
    model = RandomForestClassifier(
        n_estimators=100,
        max_depth=10,
        random_state=42,
        n_jobs=-1
    )
    model.fit(X_train_processed, y_train)

    # 4. Evaluation
    y_pred = model.predict(X_test_processed)
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Model Accuracy: {accuracy:.4f}")
    
    # Save model
    joblib.dump(model, model_save_path)
    print(f"Model saved to {model_save_path}")

if __name__ == "__main__":
    dataset_path = '/home/anony_mash/Downloads/UNSW_NB15_training-set.csv'
    save_dir = 'ml_engine/models'
    
    # Ensure directory exists
    if not os.path.exists(save_dir):
        os.makedirs(save_dir)
        
    model_path = os.path.join(save_dir, 'random_forest.pkl')
    
    train_initial_model(dataset_path, model_path)
 