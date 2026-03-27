
import unittest
import pandas as pd
import numpy as np
import sys
import os
import json
from unittest.mock import MagicMock, patch

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from ml_engine.preprocessing.cleaner import DataCleaner
from ml_engine.preprocessing.feature_extractor import FeatureExtractor
from ml_engine.detection.rule_based import RuleBasedDetector
from ml_engine.nlp.AI_analyzer import AIAnalyzer

class TestMLEngine(unittest.TestCase):
    def setUp(self):
        # Create dummy data
        self.data = pd.DataFrame({
            'srcip': ['192.168.1.1', '10.0.0.1'],
            'sport': ['12345', '80'],
            'dstip': ['192.168.1.2', '10.0.0.2'],
            'dsport': [443, '4444'], 
            'proto': ['tcp', 'udp'],
            'state': ['CON', 'INT'],
            'service': ['http', 'dns'],
            'message': ['Normal traffic', 'SELECT * FROM users'], # For rule checks
            'label': [0, 1]
        })
        
    def test_cleaner(self):
        print("\nTesting DataCleaner...")
        cleaner = DataCleaner()
        cleaned = cleaner.clean(self.data)
        
        self.assertNotIn('srcip', cleaned.columns)
        self.assertTrue(pd.api.types.is_numeric_dtype(cleaned['sport']))
        print("DataCleaner passed.")

    def test_rule_based(self):
        print("\nTesting RuleBasedDetector...")
        detector = RuleBasedDetector()
        
        sqli_log = {'message': "param = '1' OR '1'='1'"}
        xss_log = {'message': "<script>alert(1)</script>"}
        normal_log = {'message': "GET /index.html HTTP/1.1"}
        
        self.assertTrue(len(detector.detect(sqli_log)) > 0)
        self.assertTrue(len(detector.detect(xss_log)) > 0)
        self.assertEqual(len(detector.detect(normal_log)), 0)
        print("RuleBasedDetector passed.")

    @patch('google.generativeai.GenerativeModel')
    @patch('google.generativeai.configure')
    def test_ai_analyzer_format(self, mock_configure, mock_model_class):
        print("\nTesting AI Analyzer (Gemini) JSON parsing...")
        
        # Mock the model instance and its generate_content method
        mock_model_instance = MagicMock()
        mock_model_class.return_value = mock_model_instance
        
        mock_response = MagicMock()
        mock_content = {
            "suspicious": True,
            "attack_type": "SQL Injection",
            "severity": "High",
            "explanation": "Detected SQL logic manipulation."
        }
        mock_response.text = json.dumps(mock_content)
        mock_model_instance.generate_content.return_value = mock_response
        
        analyzer = AIAnalyzer(api_key="test_key")
        result = analyzer.analyze_log({'message': "UNION SELECT"})
        
        self.assertTrue(result['suspicious'])
        self.assertEqual(result['attack_type'], "SQL Injection")
        print("AI Analyzer passed.")

if __name__ == '__main__':
    unittest.main()
