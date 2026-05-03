## 2025-02-28 - Secure API Endpoints
**Vulnerability:** CRITICAL: Missing Authentication on API Endpoints. User-facing views and automated ingestion endpoints lacked explicit `permission_classes`.
**Learning:** The default `REST_FRAMEWORK` settings in `backend/settings.py` did not include a default fallback permission class. Relying on default configurations to secure all endpoints is a vulnerability pattern, leading to unauthorized access.
**Prevention:** Always define explicit `permission_classes` on every individual API view. Use custom permission logic like `HasAPIKey` for machine-to-machine integrations and `IsAuthenticated` for user-facing actions to ensure proper authorization without breaking specific workflows.
