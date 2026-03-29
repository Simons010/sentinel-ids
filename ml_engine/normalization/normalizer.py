from ml_engine.normalization.log_parser import LogParser
from ml_engine.normalization.enricher import LogEnricher

class LogNormalizer:
    def __init__(self):
        self.parser = LogParser()
        self.enricher = LogEnricher()
        
    def split_logs(self, raw_text):
        return [
            block.strip()
            for block in raw_text.split("\n\n")
            if block.strip()
        ]
        
    def normalize(self, raw_text):
        blocks = self.split_logs(raw_text)
        normalized_logs = []

        for block in blocks:
            lines = [l.strip() for l in block.split("\n") if l.strip()]
            
            for line in lines:
                try:
                    parsed = self.parser.parse_line(line)
                    enriched = self.enricher.enrich(parsed)
                    normalized_logs.append(enriched)
                    
                except Exception as e:
                    print(f"Warning: Failed to process line: {line!r} — {e}")
                    normalized_logs.append({
                        "timestamp": None,
                        "host": None,
                        "process": None,
                        "pid": None,
                        "message": line,
                        "src_ip": None,
                        "dst_ip": None,
                        "src_port": 0,
                        "dst_port": 0,
                        "proto": None,
                        "service": None,
                        "event_type": "unknown",
                        "raw": line,
                    })

        return normalized_logs