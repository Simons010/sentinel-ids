## 2024-05-24 - Missing Explicit Authentication on Sensitive Django REST Framework Views
**Vulnerability:** The Django application failed to secure sensitive user-facing endpoints because it didn't define a DEFAULT_PERMISSION_CLASSES fallback, leaving multiple REST APIs exposed to unauthorized public access.
**Learning:** In a fail-secure architecture, lacking a fallback configuration causes the Django REST Framework to default to AllowAny. You must always explicitly define `permission_classes = [IsAuthenticated]` on sensitive user-facing APIViews to ensure correct authorization checks.
**Prevention:** Always verify `REST_FRAMEWORK` settings for `DEFAULT_PERMISSION_CLASSES` and explicitly attach `permission_classes = [IsAuthenticated]` to every new sensitive endpoint during creation.
