## 2024-05-24 - Fix missing authorization on detail views
**Vulnerability:** Found IDOR / Authorization Bypass in `IntegrationApiKeyDetailView` and `TeamMemberDetailView`. The list views were protected by `IsAdminUser`, but detail views were missing the permission check.
**Learning:** Always verify that detail views corresponding to admin-only lists also explicitly apply `permission_classes = [IsAdminUser]`, as the default is just `IsAuthenticated` and there is no object-level filtering.
**Prevention:** Apply `permission_classes = [IsAdminUser]` to all relevant detail views matching protected list views.
