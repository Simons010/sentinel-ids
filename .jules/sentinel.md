## 2024-05-24 - Missing Admin Authorizations on Detail Endpoints
**Vulnerability:** IDOR vulnerability where administrative detail endpoints like `ReportDownloadView`, `IntegrationApiKeyDetailView`, and `TeamMemberDetailView` fallback to the default `IsAuthenticated` permission instead of explicitly enforcing `IsAdminUser`.
**Learning:** Django REST framework applies default permissions from settings (e.g., `IsAuthenticated`). Any endpoint intended only for privileged roles must explicitly declare `permission_classes = [IsAdminUser]`.
**Prevention:** Always verify and apply `permission_classes` overrides for sensitive detail endpoints to ensure proper access control.
