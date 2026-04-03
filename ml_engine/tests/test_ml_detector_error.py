
import unittest
import sys
from unittest.mock import MagicMock, patch

# Define mock classes for sklearn to avoid metaclass conflicts
class MockBaseEstimator: pass
class MockTransformerMixin: pass

# Local patching for missing dependencies to avoid global side effects
mock_modules = {
    "pandas": MagicMock(),
    "numpy": MagicMock(),
    "joblib": MagicMock(),
    "django": MagicMock(),
    "django.conf": MagicMock(),
    "sklearn": MagicMock(),
    "sklearn.preprocessing": MagicMock(),
    "sklearn.base": MagicMock(),
}
mock_modules["sklearn.base"].BaseEstimator = MockBaseEstimator
mock_modules["sklearn.base"].TransformerMixin = MockTransformerMixin

class TestMLDetectorErrorPath(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        # Apply global-like mocks for this test class only
        cls.modules_patcher = patch.dict('sys.modules', mock_modules)
        cls.modules_patcher.start()

        from ml_engine.detection.ml_detector import MLDetector
        cls.MLDetector = MLDetector

    @classmethod
    def tearDownClass(cls):
        cls.modules_patcher.stop()

    def setUp(self):
        self.model_path = "dummy_model.joblib"
        self.extractor_path = "dummy_extractor.joblib"

        with patch('os.path.exists', return_value=True):
            with patch('joblib.load') as mock_load:
                mock_load.side_effect = [MagicMock(), MagicMock()]
                self.detector = self.MLDetector(self.model_path, self.extractor_path)
                self.detector.load_model()

    def test_predict_extractor_failure(self):
        """Test that an exception in extractor.transform is correctly re-raised by predict."""
        log_data = {'message': 'test log'}

        # Mock the internal components of the detector to reach the transform call
        mock_df = MagicMock()
        mock_df.__len__.return_value = 1

        self.detector.builder.build = MagicMock(return_value=mock_df)

        import pandas as pd
        with patch('pandas.concat', return_value=mock_df):
            self.detector.cleaner.clean = MagicMock(return_value=mock_df)

            # Simulate failure in the extractor
            expected_error_msg = "Extraction failed"
            self.detector.extractor.transform.side_effect = Exception(expected_error_msg)

            # Verify that the Exception is re-raised
            with self.assertRaises(Exception) as context:
                self.detector.predict(log_data)

            self.assertEqual(str(context.exception), expected_error_msg)
            self.detector.extractor.transform.assert_called_once_with(mock_df)

if __name__ == '__main__':
    unittest.main()
