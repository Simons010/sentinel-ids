## 2024-07-13 - Fixed IDOR in Detail Views
**Vulnerability:** Missing `IsAdminUser` permission on `TeamMemberDetailView` and `IntegrationApiKeyDetailView` endpoints, allowing any authenticated user to potentially delete API keys or modify team members.
**Learning:** Detail views and nested API endpoints in Django REST Framework must explicitly declare `permission_classes = [IsAdminUser]` when they handle sensitive administrative actions, as they don't automatically inherit the permissions of their related list views (e.g., `IntegrationApiKeysView`).
**Prevention:** Always verify that both list AND detail views for sensitive resources have matching and explicit authorization checks.
