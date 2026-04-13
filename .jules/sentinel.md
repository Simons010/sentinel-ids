## 2026-04-11 - [Missing Authentication on API Endpoints]
**Vulnerability:** Found multiple API endpoints in `backend/app/api/views.py` that did not enforce authentication, allowing unauthorized public access.
**Learning:** The Django backend's `REST_FRAMEWORK` configuration does not define a `DEFAULT_PERMISSION_CLASSES` fallback. Therefore, all Django REST Framework API views must explicitly declare `permission_classes = [IsAuthenticated]` (or equivalent) to secure them.
**Prevention:** Either add `DEFAULT_PERMISSION_CLASSES` to the global REST Framework settings or explicitly define `permission_classes` on every new DRF APIView.
