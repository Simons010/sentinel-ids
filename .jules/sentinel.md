## 2024-08-17 - Missing Authorization Checks in Detail Views
**Vulnerability:** Found `IntegrationApiKeyDetailView` and `TeamMemberDetailView` lacking `permission_classes = [IsAdminUser]`, while their respective list views enforced it. Since models lack object-level filtering like `organization_id`, any authenticated user could modify or delete other team members and API keys (IDOR/Auth Bypass).
**Learning:** Detail views must explicitly mirror the authorization logic of their parent list views, especially when relying entirely on view-level permissions rather than object-level permissions.
**Prevention:** Always verify detail endpoint permissions when building admin-only list views. Consider enforcing object-level ownership checks defensively even if the view relies on `IsAdminUser`.
