## 2024-07-08 - Missing Authorization on Admin Detail Endpoints
**Vulnerability:** Insecure Direct Object Reference (IDOR) and broken access control in `IntegrationApiKeyDetailView` and `TeamMemberDetailView` where any authenticated user could delete API keys or team members.
**Learning:** In Django REST Framework, applying `permission_classes` to a list view (e.g., `TeamMembersView`) does not automatically secure its corresponding detail view (e.g., `TeamMemberDetailView`). Each class-based view must explicitly define its own `permission_classes`.
**Prevention:** Always verify that `permission_classes` are applied symmetrically across all related endpoints for a given model, explicitly securing both list and detail views.
