## 2024-05-24 - Missing Authentication on API Endpoints
**Vulnerability:** Django REST Framework API endpoints in `backend/app/api/views.py` were missing `permission_classes = [IsAuthenticated]`, leaving sensitive data and actions (like Log Ingestion, Alert Listing, Network Stats, and Settings) exposed to unauthenticated users.
**Learning:** Default global permissions might not be configured strictly enough in `settings.py` (e.g. `DEFAULT_PERMISSION_CLASSES`), so explicitly adding `IsAuthenticated` to sensitive API views is required to enforce authentication.
**Prevention:** Always verify that API views enforce authentication explicitly using `permission_classes = [IsAuthenticated]` or ensure the global `DEFAULT_PERMISSION_CLASSES` is set strictly.
