## 2024-05-24 - IDOR Vulnerabilities in Detail Views
**Vulnerability:** IDOR vulnerabilities on detail endpoints (`IntegrationApiKeyDetailView`, `TeamMemberDetailView`, `ReportDownloadView`) due to missing explicit `permission_classes = [IsAdminUser]`.
**Learning:** In Django REST Framework, detail API views do not automatically inherit permissions from their corresponding list views. Every view class must have `permission_classes` explicitly declared.
**Prevention:** Always explicitly declare `permission_classes` on every view class (e.g., `permission_classes = [IsAdminUser]`) to ensure consistent access control and prevent IDOR vulnerabilities.
