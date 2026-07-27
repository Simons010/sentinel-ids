## 2024-05-25 - IDOR Vulnerability in DRF Detail Views
**Vulnerability:** Insecure Direct Object Reference (IDOR) on detail endpoints (e.g., IntegrationApiKeyDetailView, TeamMemberDetailView, ReportDownloadView) due to missing explicit permission_classes.
**Learning:** In Django REST Framework, detail API views do not automatically inherit permissions from their corresponding list views. The default permission of IsAuthenticated allows any logged-in user to access these administrative detail views.
**Prevention:** Always explicitly declare permission_classes = [IsAdminUser] (or appropriate permissions) on every detail view class to ensure consistent access control and prevent unauthorized access.
