## 2024-07-01 - Missing Authorization on Admin Detail Views
**Vulnerability:** IDOR and authorization bypass in `IntegrationApiKeyDetailView` and `TeamMemberDetailView` due to missing `permission_classes = [IsAdminUser]`, falling back to the default `IsAuthenticated`.
**Learning:** The default Django REST Framework permission in this project is `IsAuthenticated`. When securing detail endpoints that require administrative access, explicitly declare `permission_classes = [IsAdminUser]` to prevent IDOR and privilege escalation.
**Prevention:** Always verify that both list and detail views in Django REST Framework have matching, explicit permission classes for sensitive operations.
