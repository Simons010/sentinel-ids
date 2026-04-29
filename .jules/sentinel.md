## 2024-05-24 - Missing Authorization on API Views
**Vulnerability:** Many API endpoints, including automated ingestion endpoints, lack authorization checks in `backend/app/api/views.py`. This means anyone could potentially interact with those endpoints.
**Learning:** In Django REST Framework, if `DEFAULT_PERMISSION_CLASSES` is not set globally, views default to `AllowAny`.
**Prevention:** Always explicitly define `permission_classes` on every view, or set a secure default in `REST_FRAMEWORK` settings and override as necessary. Automated ingestion endpoints like `LogIngestView` require specific API key authentication using `HasAPIKey` custom permission class.
