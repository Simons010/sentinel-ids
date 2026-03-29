class BatchCorrelator:
    """
    Correlates logs that arrive in batches (e.g., from a file upload) using session_id and sequence_index.
    This allows us to group related logs together and maintain their order, even if they arrive out of order.
    """
    # Attack chain patterns
    ATTACK_CHAINS = [
        # --- Initial Access ---
        {
            "name": "Brute Force Success",
            "severity": "critical",
            "pattern": ["auth_failure", "auth_failure", "successful_login"],
            "description": "Multiple failed logins followed by success — brute force compromise"
        },
        {
            "name": "Brute Force then Privilege Escalation",
            "severity": "critical",
            "pattern": ["auth_failure", "successful_login", "privilege_escalation"],
            "description": "Brute forced account immediately escalated to root"
        },
        {
            "name": "Reconnaissance to Brute Force",
            "severity": "high",
            "pattern": ["port_scan", "auth_failure"],
            "description": "Port scan followed by auth attempts — targeted attack"
        },
        {
            "name": "Reconnaissance to Compromise",
            "severity": "critical",
            "pattern": ["port_scan", "auth_failure", "successful_login"],
            "description": "Full recon-to-access chain completed"
        },

        # --- Execution & Download ---
        {
            "name": "Login then Payload Download",
            "severity": "critical",
            "pattern": ["successful_login", "remote_download"],
            "description": "Login followed by curl/wget — likely malware staging"
        },
        {
            "name": "Privilege Escalation then Download",
            "severity": "critical",
            "pattern": ["privilege_escalation", "remote_download"],
            "description": "Root access used to pull remote payload"
        },
        {
            "name": "Compromise to Full Execution",
            "severity": "critical",
            "pattern": ["auth_failure", "successful_login", "privilege_escalation", "remote_download"],
            "description": "Full kill chain: brute force → access → root → payload download"
        },

        # --- Persistence ---
        {
            "name": "Login then Scheduled Task",
            "severity": "high",
            "pattern": ["successful_login", "scheduled_task"],
            "description": "Login followed by cron job — persistence mechanism"
        },
        {
            "name": "Privilege Escalation then Persistence",
            "severity": "critical",
            "pattern": ["privilege_escalation", "scheduled_task"],
            "description": "Root-level cron job added — likely backdoor"
        },
        {
            "name": "Full Persistence Chain",
            "severity": "critical",
            "pattern": ["successful_login", "privilege_escalation", "scheduled_task"],
            "description": "Access → escalation → persistence — attacker establishing foothold"
        },

        # --- Web Attacks ---
        {
            "name": "SQL Injection then XSS",
            "severity": "high",
            "pattern": ["sql_injection", "xss_attempt"],
            "description": "Combined web attack — automated scanner or persistent attacker"
        },
        {
            "name": "Web Exploit then Download",
            "severity": "critical",
            "pattern": ["sql_injection", "remote_download"],
            "description": "SQL injection used to stage remote payload"
        },
        {
            "name": "XSS then Credential Theft",
            "severity": "high",
            "pattern": ["xss_attempt", "successful_login"],
            "description": "XSS followed by login — possible session hijack"
        },
        {
            "name": "Web Attack to Full Compromise",
            "severity": "critical",
            "pattern": ["sql_injection", "successful_login", "privilege_escalation"],
            "description": "Web exploitation leading to full system compromise"
        },

        # --- DDoS ---
        {
            "name": "Recon then DDoS",
            "severity": "high",
            "pattern": ["port_scan", "ddos_attack"],
            "description": "Reconnaissance followed by denial of service"
        },
        {
            "name": "Compromise then DDoS",
            "severity": "critical",
            "pattern": ["successful_login", "ddos_attack"],
            "description": "Compromised host used to launch DDoS — botnet activity"
        },
        {
            "name": "Full DDoS Takeover Chain",
            "severity": "critical",
            "pattern": ["auth_failure", "successful_login", "ddos_attack"],
            "description": "Account brute forced then used as DDoS launch point"
        },

        # --- APT ---
        {
            "name": "Full APT Kill Chain",
            "severity": "critical",
            "pattern": ["port_scan", "auth_failure", "successful_login", "privilege_escalation", "remote_download", "scheduled_task"],
            "description": "Complete APT sequence: recon → brute force → access → escalation → payload → persistence"
        },
        {
            "name": "Living off the Land",
            "severity": "critical",
            "pattern": ["successful_login", "privilege_escalation", "scheduled_task", "remote_download"],
            "description": "Native tools used for stealth — no malware until final stage"
        },
        {
            "name": "Insider Threat Pattern",
            "severity": "high",
            "pattern": ["successful_login", "privilege_escalation", "remote_download"],
            "description": "Valid login escalating privileges and exfiltrating data"
        },
    ]
    
    def correlate(self, log_instances):
        """
        Analyze a batch of related logs for attack chain patterns.
        Returns a correlation result dict.
        """
        if len(log_instances) < 2:
            return None  # No correlation for single log entries
        
        # Build ordered event sequence
        sorted_logs = sorted(
            log_instances, 
            key=lambda l: (l.sequence_index or 0) 
        )
        event_sequence = [log.event_type for log in sorted_logs if log.event_type]
        unique_ips = set(l.src_ip for l in sorted_logs if l.src_ip)
        
        matched_chains = []
        for chain in self.ATTACK_CHAINS:
            if self._matches_pattern(event_sequence, chain["pattern"]):
                matched_chains.append(chain)
                
        if not matched_chains:
            return None
        
        # Return highest severity chain match
        severity_order = ["critical", "high", "medium", "low", "informational"]
        matched_chains.sort(key=lambda c: severity_order.index(c["severity"]))
        top_match = matched_chains[0]
        
        return{
            "is_attack_chain": True,
            "chain_name": top_match["name"],
            "severity": top_match["severity"],
            "description": top_match["description"],
            "event_sequence": event_sequence,
            "involved_ips": list(unique_ips),
            "log_count": len(log_instances),
        }
        
    def _matches_pattern(self, sequence, pattern):
        """"Check if pattern appears as an ordered subsequence in the event sequence."""
        
        seq_idx = 0
        pat_idx = 0
        
        while seq_idx < len(sequence) and pat_idx < len(pattern):
            if sequence[seq_idx] == pattern[pat_idx]:
                pat_idx += 1
            seq_idx += 1
            
        return pat_idx == len(pattern)