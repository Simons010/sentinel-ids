## 2024-08-13 - Missing Authorization on Admin Detail Views
**Vulnerability:** Found IDOR/Authorization bypass where `IntegrationApiKeyDetailView` and `TeamMemberDetailView` lacked the `IsAdminUser` permission class, defaulting to `IsAuthenticated`. The corresponding list views correctly restricted access to admins.
**Learning:** Detail views do not automatically inherit the permission classes from their corresponding list views. They must be explicitly applied.
**Prevention:** Always check if a detail endpoint matching an admin-only list endpoint explicitly defines its own permission checks.
