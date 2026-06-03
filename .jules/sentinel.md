## 2024-05-24 - Exception Information Leakage in API
**Vulnerability:** The Log Upload API endpoint (`LogUploadView`) in `backend/app/api/views.py` leaked internal error details on failure by sending `str(e)` back in the `details` field of the HTTP 500 response.
**Learning:** Returning raw Python exception strings to the client over an API endpoint can leak internal environment specifics like stack traces, variable contents, SQL database schema errors, and internal file paths. This breaks the principle of failing securely.
**Prevention:** Catch generic exceptions and return generic, sanitized error responses to the user, logging the actual details server-side only.
