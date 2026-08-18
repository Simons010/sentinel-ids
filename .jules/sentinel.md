## 2024-05-24 - Fix Authorization Bypass in Admin Detail Views
**Vulnerability:** Missing `IsAdminUser` permission checks on `IntegrationApiKeyDetailView` and `TeamMemberDetailView` allowed any authenticated user to revoke API keys or modify/delete team members.
**Learning:** Detail endpoints corresponding to admin-only list views must explicitly include the same permission classes to prevent authorization bypass and IDOR, as the models do not use an organization field for object-level filtering.
**Prevention:** Always verify that detail views enforcing role-based access control share the same or stricter permission classes as their corresponding list views.
