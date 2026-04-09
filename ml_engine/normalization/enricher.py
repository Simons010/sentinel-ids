import re

IP_PATTERN = re.compile(r'(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})')
PORT_PATTERN = re.compile(r'port\s+(\d+)')

class LogEnricher:
    def enrich(self, log):
        message = log["message"]
        
        ips = IP_PATTERN.findall(message)
        ports = PORT_PATTERN.findall(message)
        
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

        # --- Authentication ---
        if "failed password" in msg or "authentication failure" in msg or "failed login" in msg:
            return "auth_failure"
        if "invalid user" in msg or "illegal user" in msg:
            return "invalid_user"
        if "accepted password" in msg or "session opened" in msg:
            return "successful_login"
        if "session closed" in msg or "disconnected" in msg:
            return "logout"
        if "account locked" in msg or "too many authentication failures" in msg:
            return "account_lockout"
        if "root" in msg and ("login" in msg or "session" in msg):
            return "root_login"
        if "publickey" in msg or "accepted publickey" in msg:
            return "ssh_key_auth"
        if "password changed" in msg or "passwd" in msg:
            return "password_change"

        # --- Privilege Escalation ---
        if "sudo" in msg and "authentication failure" in msg:
            return "sudo_failure"
        if "sudo" in msg or " su " in msg:
            return "privilege_escalation"
        if "permission denied" in msg or "operation not permitted" in msg:
            return "permission_denied"

        # --- Network ---
        if "port scan" in msg:
            return "port_scan"
        if "syn flood" in msg:
            return "syn_flood"
        if "ddos" in msg:
            return "ddos_attack"
        if "connection refused" in msg:
            return "connection_refused"
        if "blocked" in msg or "drop" in msg and "iptables" in msg:
            return "firewall_block"
        if "dns" in msg and ("query" in msg or "lookup" in msg):
            return "dns_lookup"

        # --- Web Attacks ---
        if "sql injection" in msg or "sqlmap" in msg:
            return "sql_injection"
        if "xss" in msg or "<script" in msg:
            return "xss_attempt"
        if "../" in msg or "path traversal" in msg:
            return "path_traversal"
        if "nikto" in msg or "dirbuster" in msg or "gobuster" in msg:
            return "web_scan"
        if "select " in msg and "from " in msg:
            return "sql_injection"
        if "/etc/passwd" in msg or "/etc/shadow" in msg:
            return "file_access"

        # --- Malware & Execution ---
        if "curl" in msg or "wget" in msg or "fetch" in msg:
            return "remote_download"
        if "bash -i" in msg or "/dev/tcp" in msg or "nc -e" in msg:
            return "reverse_shell"
        if "base64" in msg and ("decode" in msg or "|" in msg):
            return "obfuscated_command"

        # --- Persistence ---
        if "cron" in msg:
            return "scheduled_task"
        if "systemctl enable" in msg or "service install" in msg:
            return "service_install"
        if "useradd" in msg or "adduser" in msg:
            return "user_created"
        if "usermod" in msg:
            return "user_modified"
        if "authorized_keys" in msg:
            return "ssh_key_added"

        # --- Data & Exfiltration ---
        if "rm -rf" in msg or "shred" in msg:
            return "file_deletion"
        if "tar " in msg or "zip " in msg:
            return "archive_creation"

        # --- System ---
        if "reboot" in msg or "shutdown" in msg:
            return "system_reboot"
        if "systemctl stop" in msg or "service stop" in msg:
            return "service_stop"
        if "truncate" in msg or "logrotate" in msg:
            return "log_cleared"
        if "insmod" in msg or "modprobe" in msg:
            return "kernel_module"

        return "unknown"
            