## 2024-05-18 - Prevent information leakage via unhandled exceptions
**Vulnerability:** The `LogUploadView` endpoint was returning raw exception details (`str(e)`) in its 500 error response JSON payload.
**Learning:** Returning raw exception messages to the client risks leaking internal system details, path structures, database schema information, or stack traces which an attacker can use to gather intelligence.
**Prevention:** In Django/DRF exception handling blocks, record the raw error internally (e.g., database or logs) but return a sanitized, generic error message (e.g., "Failed to process file") to the client.
