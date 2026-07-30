## 2024-05-19 - Missing Authorization on Detail Views
**Vulnerability:** Found Insecure Direct Object Reference (IDOR) vulnerabilities on DRF detail views (`ReportDownloadView`, `IntegrationApiKeyDetailView`, `TeamMemberDetailView`) where they did not inherit the `IsAdminUser` permission from their respective list views.
**Learning:** In Django REST Framework, detail API views do not automatically inherit permissions from their corresponding list views. They default to `IsAuthenticated` allowing unauthorized access.
**Prevention:** Always explicitly declare `permission_classes = [IsAdminUser]` on detail views that require administrative access to prevent IDOR vulnerabilities.
