## 2026-04-08 - Enforce Authentication on Sensitive API Endpoints
**Vulnerability:** Missing authentication on all core API endpoints in `backend/app/api/views.py`. Dashboard stats, alerts, log uploads, analytics, and settings were publicly accessible, potentially exposing sensitive system details and user logs.
**Learning:** The endpoints utilized Django REST Framework's `APIView` without explicitly specifying `permission_classes`, allowing unauthenticated access by default. Relying on default REST Framework configurations can leave critical application surfaces unprotected.
**Prevention:** Always verify endpoint permissions explicitly by specifying `permission_classes`, such as `[IsAuthenticated]`, for any API views handling sensitive data or operations.
