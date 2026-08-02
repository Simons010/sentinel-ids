## 2024-11-28 - Add missing permission_classes to detail views
**Vulnerability:** IDOR vulnerability due to missing `permission_classes` on Django REST Framework detail views (`ReportDownloadView`, `IntegrationApiKeyDetailView`, `TeamMemberDetailView`).
**Learning:** In Django REST Framework, detail API views do not automatically inherit permissions from their corresponding list views. They must be explicitly declared on every view class.
**Prevention:** Ensure `permission_classes` are explicitly declared on all views, particularly detail views, to enforce consistent access control.
