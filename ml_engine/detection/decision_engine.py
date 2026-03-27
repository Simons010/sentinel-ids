from ml_engine.detection.ml_detector import MLDetector
from ml_engine.detection.rule_based import RuleBasedDetector
from ml_engine.nlp.AI_analyzer import AIAnalyzer
from django.conf import settings  

class DecisionEngine:
    def __init__(self, model_path, extractor_path, ai_enabled=False):
        self.ml_detector = MLDetector(model_path, extractor_path)
        self.rule_detector = RuleBasedDetector()
        self.ai_analyzer = AIAnalyzer() if ai_enabled else None
        self.ml_ready = False
        self.ai_enabled = ai_enabled
        
        try:
            self.ml_detector.load_model() 
            self.ml_ready = True
        except Exception as e:
            print(f"Warning: ML Model could not be loaded: {e}. Running in Rule-only mode.")

    def analyze(self, log_entry):
        """
        Orchestrate analysis:
        1. Rules (Signatures, regex)
        2. ML (Statistical anomaly on structured data)
        3. AI (Semantic analysis on message - optional/on demand)
        """
        result = {
            'is_suspicious': False,
            'confidence_score': 0.0,
            'alerts': [],
            'ml_analysis': None,
            'ai_analysis': None
        }

        # 1. Rule-based checks
        rule_alerts = self.rule_detector.detect(log_entry)
        if rule_alerts:
            print(f"\n Rule-based alerts triggered: {rule_alerts}")
            result['is_suspicious'] = True
            result['confidence_score'] = 1.0 # High confidence if signature matches
            for alert in rule_alerts:
                result['alerts'].append(f"RULE: {alert['rule']} \n")

        # 2. ML checks
        if self.ml_ready and isinstance(log_entry, dict):
            try:
                print("\n Triggering ML Analysis...")
                ml_res = self.ml_detector.predict(log_entry)
                result['ml_analysis'] = ml_res
                
                if ml_res.get('is_anomaly'):
                    result['is_suspicious'] = True
                    result['confidence_score'] = max(
                        result['confidence_score'],
                        ml_res.get('confidence', 0)
                    )
                    result['alerts'].append(
                        f"ML: Statistical Anomaly Detected (Conf: {ml_res.get('confidence', 0):.2f}) \n"
                    )
                
                print("ML RESULT:", ml_res)
                 
            except Exception as e:
                print(f"ML ERROR: {e}")
                result['ml_analysis'] = {"error": str(e)}

        # 3. AI Analysis (Semantic) - Trigger if suspicious or explicitly requested
        # To save costs/latency, typically only run if suspicious or high severity
        if self.ai_enabled and (result['is_suspicious'] or log_entry.get("message")):
            try:
                print("\n Triggering AI Analysis...")
                ai_res = self.ai_analyzer.analyze_log(log_entry)
                result['ai_analysis'] = ai_res
                
                if isinstance(ai_res, dict) and ai_res.get('suspicious'): 
                    result['is_suspicious'] = True
                    result['confidence_score'] = max(
                        result['confidence_score'],
                        float(ai_res.get('confidence', 0))
                    )
                    result['alerts'].append(
                        f"AI: {ai_res.get('attack_type')} - {ai_res.get('explanation')} - Conf: {ai_res.get('confidence')} \n"
                    )
                
                print("AI RESULT:", ai_res)
                print("\n")
                
            except Exception as e:
                print(f"AI ERROR: {e}")
                result['ai_analysis'] = {"error": str(e)}

        return result
