## 2023-10-27 - Fix IDOR in Detail Views
**Vulnerability:** IDOR in settings-related detail endpoints (`IntegrationApiKeyDetailView`, `TeamMemberDetailView`) due to missing explicit authorization checks, allowing any authenticated user to modify or delete resources.
**Learning:** Django REST Framework's default `IsAuthenticated` permission doesn't restrict access by role. We need to explicitly declare `permission_classes = [IsAdminUser]` for detail endpoints.
**Prevention:** Always verify that every view, including detail views, has appropriate `permission_classes` defined, especially when they manage sensitive settings or admin-level data.
