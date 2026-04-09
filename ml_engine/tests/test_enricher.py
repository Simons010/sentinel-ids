
import unittest
import sys
import os

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from ml_engine.normalization.enricher import LogEnricher

class TestLogEnricher(unittest.TestCase):
    def setUp(self):
        self.enricher = LogEnricher()

    def test_enrich_ips(self):
        log = {"message": "Connection from 192.168.1.1 to 10.0.0.1"}
        enriched = self.enricher.enrich(log)
        self.assertEqual(enriched["src_ip"], "192.168.1.1")
        self.assertEqual(enriched["dst_ip"], "10.0.0.1")

    def test_enrich_ports(self):
        log = {"message": "traffic on port 80 and port 443"}
        enriched = self.enricher.enrich(log)
        self.assertEqual(enriched["src_port"], 80)
        self.assertEqual(enriched["dst_port"], 443)

    def test_enrich_no_matches(self):
        log = {"message": "no ips or ports here"}
        enriched = self.enricher.enrich(log)
        self.assertIsNone(enriched["src_ip"])
        self.assertIsNone(enriched["dst_ip"])
        self.assertEqual(enriched["src_port"], 0)
        self.assertEqual(enriched["dst_port"], 0)

if __name__ == "__main__":
    unittest.main()
