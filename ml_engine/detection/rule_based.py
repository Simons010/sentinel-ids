
import re

class RuleBasedDetector:
    def __init__(self):
        self.rules = [ 
            # 1. SQL Injection Patterns
            {
                'name': 'SQL Injection Attempt',
                'severity': 'high',
                'pattern': r"(?i)(union\s+select|select\s+.*\s+from|insert\s+into|update\s+.*\s+set|delete\s+from|drop\s+table|--|#|\/\*|\*\/|'\s*or\s*'1'='1)",
                'field': 'message'
            },
            # 2. XSS Patterns
            {
                'name': 'Cross-Site Scripting (XSS)',
                'severity': 'high',
                'pattern': r"(?i)(<script>|javascript:|onerror=|onload=|eval\()",
                'field': 'message'
            },
            # 3. Path Traversal / LFI
            {
                'name': 'Path Traversal / LFI',
                'severity': 'high',
                'pattern': r"(?i)(\.\./|\.\.\\|/etc/passwd|c:\\windows\\system32)",
                'field': 'message'
            },
            # 4. Command Injection
            {
                'name': 'Command Injection',
                'severity': 'critical',
                'pattern': r"(?i)(;|\||`|\$\(.*\)|&&)\s*(cat|ls|pwd|whoami|netcat|nc|bash|sh|wget|curl)",
                'field': 'message'
            },
            # 5. Suspicious User Agents (Scanners/Bots)
            {
                'name': 'Suspicious User Agent',
                'severity': 'medium',
                'pattern': r"(?i)(sqlmap|nikto|nmap|masscan|gobuster|dirbuster|hydra|burp|metasploit)",
                'field': 'user_agent' # Assumes this field exists or needs to be extracted from message
            },
             # 6. Auth Failures (Specific keywords)
            {
                'name': 'Authentication Failure',
                'severity': 'medium',
                'pattern': r"(?i)(failed password|authentication failure|invalid user|bad credentials)",
                'field': 'message'
            },
             # 7. Suspicious Ports (Expanded)
            {
                'name': 'Suspicious Port Usage',
                'severity': 'medium',
                'check_func': self._check_suspicious_ports
            }
        ]
        
    def detect(self, log_entry):
        """
        Apply rules to a single log entry.
        Returns a list of triggered alerts.
        """
        alerts = []
        for rule in self.rules:
            # Regex Pattern Rules
            if 'pattern' in rule:
                target_field = rule.get('field', 'message')
                # Check if field exists in log_entry
                content = str(log_entry.get(target_field, ''))
                
                # Also check 'message' as fallback if specific field missing
                if not content and target_field != 'message':
                     content = str(log_entry.get('message', ''))

                if content and re.search(rule['pattern'], content):
                    alerts.append({
                        'rule': rule['name'],
                        'severity': rule['severity'],
                        'evidence': f"Pattern matched in {target_field}"
                    })
            
            # Function-based Rules
            elif 'check_func' in rule:
                if rule['check_func'](log_entry):
                    alerts.append({
                        'rule': rule['name'],
                        'severity': rule['severity'],
                        'evidence': "Custom check failed"
                    })
                    
        return alerts

    def _check_suspicious_ports(self, log):
        # Common backdoor/malware ports
        suspicious_ports = {
            4444: 'Metasploit',
            6667: 'IRC (Botnet)',
            31337: 'Back Orifice',
            1337: 'Leet',
            23: 'Telnet (Insecure)',
            21: 'FTP (Insecure)'
        }
        
        # Check both source and dest ports if available
        for p_field in ['sport', 'dsport', 'port']:
            port = log.get(p_field)
            try:
                port = int(port)
                if port in suspicious_ports:
                    return True
            except (ValueError, TypeError):
                continue
                
        return False
