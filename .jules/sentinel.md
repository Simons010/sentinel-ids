## 2024-05-30 - DRF Detail View Permission Inheritance IDOR
**Vulnerability:** In Django REST Framework, detail API views (`IntegrationApiKeyDetailView`, `TeamMemberDetailView`) were missing `permission_classes = [IsAdminUser]` and did not automatically inherit them from their corresponding list views, allowing unauthorized access (IDOR / auth bypass).
**Learning:** Detail views in DRF require explicitly defining `permission_classes`, even if the list view has them. The default `IsAuthenticated` permission allowed any logged-in user to access these admin-only endpoints.
**Prevention:** Always explicitly apply `permission_classes` on every view class to ensure consistent access control.
