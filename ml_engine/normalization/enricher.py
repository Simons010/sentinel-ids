import re

IP_PATTERN = r'(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})' 
PORT_PATTERN = r'port\s+(\d+)'

class LogEnricher:
    def enrich(self, log):
        message = log["message"]
        
        ips = re.findall(IP_PATTERN, message)
        ports = re.findall(PORT_PATTERN, message)
        
        return{
            **log,
            
            # network fields
            "src_ip": ips[0] if ips else None,
            "dst_ip": ips[1] if len(ips) > 1 else None,
            
            "src_port": int(ports[0]) if ports else 0,
            "dst_port": int(ports[1]) if len(ports) >1 else 0,
            
            # protocol
            "proto": self.detect_proto(message),
            
            # service 
            "service": log.get("process"),
            
            # event type
            "event_type": self.detect_event_type(message),
        }
        
    def detect_proto(self, msg):
        msg = msg.lower()
        if "ssh" in msg:
            return "tcp"
        if "http" in msg or "https" in msg:
            return "tcp"
        if "dns" in msg:
            return "udp"
        if "icmp" in msg:
            return "icmp"
        return "tcp"
        
    def detect_event_type(self, msg):
        msg = msg.lower()
        if "failed login" in msg or "authentication failure" in msg:
            return "auth_failure"
        if "accepted password" in msg:
            return "successful_login"
        if "port scan" in msg:
            return "port_scan"
        if "sql injection" in msg:
            return "sql_injection"
        if "xss attempt" in msg:
            return "xss_attempt"
        if "ddos" in msg:
            return "ddos_attack"
        if "sudo" in msg:
            return "privilege_escalation"
        if "curl" in msg or "wget" in msg:
            return "remote_download"
        if "cron" in msg:
            return "scheduled_task"
        return "unknown"
        