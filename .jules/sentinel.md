## 2026-02-15 - Prevent Stack Trace/Error Leakage in Log Upload API
**Vulnerability:** The Log Upload API (`LogUploadView`) was returning raw exception strings (`str(e)`) directly to the client in 500 error responses.
**Learning:** Developers logged exceptions to the database but also returned them in the HTTP response body. This leaks internal implementation details (e.g., file paths, module names) to potential attackers.
**Prevention:** Always return generic, sanitized error messages (e.g., 'An internal error occurred during processing') to the user, while saving the raw exception details server-side (logs/DB) for debugging.
