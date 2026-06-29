## 2024-05-24 - Missing Authorization on Admin Endpoints
**Vulnerability:** Found `TeamMemberDetailView` and `IntegrationApiKeyDetailView` were missing `IsAdminUser` permission classes, allowing any authenticated user to delete team members and API keys.
**Learning:** Even if the list/create views (`TeamMembersView`, `IntegrationApiKeysView`) have `IsAdminUser`, detail views must explicitly re-declare the `permission_classes` to prevent IDOR/authorization bypass on individual objects.
**Prevention:** Always verify that every single View class in Django Rest Framework explicitly defines `permission_classes` unless relying on a strict global default.
