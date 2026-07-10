## 2024-05-18 - IDOR in Detail Views
**Vulnerability:** Insecure Direct Object Reference (IDOR) / Missing Authorization Check in `IntegrationApiKeyDetailView` and `TeamMemberDetailView`. Any authenticated user could access admin-only functionality.
**Learning:** When Django REST Framework's default permission is `IsAuthenticated`, missing explicit `permission_classes` on detail views for admin resources falls back to allowing any authenticated user.
**Prevention:** Always explicitly declare `permission_classes` on all detail views, matching the permissions of their corresponding list views.