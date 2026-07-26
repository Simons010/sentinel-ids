## 2024-11-20 - DRF Detail View Permission Inheritance
**Vulnerability:** Insecure Direct Object Reference (IDOR) and Authorization Bypass on Django REST Framework detail API views (e.g., `IntegrationApiKeyDetailView`, `TeamMemberDetailView`, `ReportDownloadView`).
**Learning:** DRF detail API views do not automatically inherit `permission_classes` from their corresponding list views. Even if a list view is secured with `IsAdminUser`, the detail view defaults to `IsAuthenticated`, allowing unauthorized users to access, modify, or delete administrative objects by guessing their IDs.
**Prevention:** Always explicitly declare `permission_classes` on every individual view class to ensure consistent access control, especially for endpoints handling sensitive operations.
