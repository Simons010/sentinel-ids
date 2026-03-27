
import pandas as pd
import numpy as np

class DataCleaner:
    def __init__(self):
        self.cols_to_drop = ['srcip', 'dstip', 'Stime', 'Ltime', 'attack_cat']

    def clean(self, df):
        """
        Perform basic data cleaning:
        - Drop irrelevant columns
        - Handle missing values
        - Convert numeric types
        """
        data = df.copy()

        # Drop columns
        # Only drop if they exist (safe drop)
        existing_cols_to_drop = [c for c in self.cols_to_drop if c in data.columns]
        data = data.drop(columns=existing_cols_to_drop)

        # Convert 'sport' and 'dsport' to numeric, coercing errors
        for col in ['sport', 'dsport']:
            if col in data.columns:
                data[col] = pd.to_numeric(data[col], errors='coerce')

        # Handle missing values (fillna with 0 for now, improvement: use imputer)
        data = data.fillna(0)

        return data
