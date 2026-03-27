import pandas as pd

class FeatureBuilder:

    def build(self, log):
        """
        Convert API log → UNSW-NB15-like feature vector
        """

        proto = (log.get("proto") or"tcp").lower()
        service = (log.get("service") or "unknown").lower()

        features = {
            # --- Core categorical ---
            "proto": proto,
            "service": service,
            "state": "CON",  # default connection state

            # --- Ports ---
            "sport": log.get("src_port", 0),
            "dsport": log.get("dst_port", 0),

            # --- Duration ---
            "dur": 0,  # not available from single log

            # --- Traffic volume ---
            "sbytes": len(log.get("message", "")),  # approximate
            "dbytes": 0,

            # --- TTL (unknown → default) ---
            "sttl": 64,
            "dttl": 64,

            # --- Load ---
            "sload": 0,
            "dload": 0,

            # --- Packet counts ---
            "spkts": 1,
            "dpkts": 1,

            # --- Means ---
            "smean": 0,
            "dmean": 0,

            # --- Connection tracking (approximate) ---
            "ct_dst_ltm": 1,
            "ct_src_ltm": 1,
            "ct_dst_src_ltm": 1,
            "ct_dst_sport_ltm": 1,
            "ct_dst_dport_ltm": 1,
        }

        return pd.DataFrame([features])