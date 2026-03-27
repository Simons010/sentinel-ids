import os
import json
import google.genai

class AIAnalyzer:
    def __init__(self, api_key=None):
        self.api_key = api_key or os.environ.get('GEMINI_API_KEY')
        if self.api_key:
            self.client = google.genai.Client(api_key=self.api_key)
        else:
            self.client = None
        
    def analyze_log(self, log_entry, context=""):
        """
        Get semantic analysis of a log message from Gemini.
        """
        if not self.client:
            return {
                "error": "AI Analysis Unavailable: No Gemini API Key provided.",
                "suspicious": False
            }

        # Extract only relevant text fields to save tokens/focus attention
        log_message = log_entry.get('message', str(log_entry))
        
        prompt = f"""
        You are a cybersecurity expert AI. Analyze the following log message semantically.
        
        Log Message:
        "{log_message}"
        
        Context:
        {context}
        
        Determine if this is suspicious or malicious.
        For severity, use these mapping as they are where applicable:
        {{
            "SQL Injection Attempt": "high",
            "Brute Force Attack": "high",
            "Traffic anomaly": "medium",
            "Normal": "informational",
            "XSS Attempt": "high",
            "Command Injection": "high",
            "Port Scan": "low",
            "DDoS Attack": "critical",
            "Privilege Escalation": "critical"
        }}
        
        Return ONLY valid JSON in the following format:
        {{
            "suspicious": boolean,
            "attack_type": "string (e.g., Brute Force, SQL Injection, Normal)",
            "severity": "string",
            "explanation": "concise human-readable string"
            "confidence": "float confidence level in :.2f (0.0 to 1.0)"
        }}
        """

        try:
            response = self.client.models.generate_content(
                model="gemini-2.5-flash",  
                contents=prompt,
            )
            result_text = response.text
            
            
            # try to parse returned text as JSON
            try:
                analysis = json.loads(result_text)
                return analysis
            except json.JSONDecodeError:
                # Fallback cleanup
                clean_text = result_text.replace("```json", "").replace("```", "").strip()
                return json.loads(clean_text)
                
        except Exception as e:
            return {
                "suspicious": False, 
                "error": f"Error querying AI: {str(e)}", 
                "raw_response": str(e)
            }