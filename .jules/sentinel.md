## 2024-07-03 - Missing Authorization Checks on Detail Endpoints
**Vulnerability:** IDOR (Insecure Direct Object Reference) / Missing Authorization. The list endpoints for settings (`IntegrationApiKeysView` and `TeamMembersView`) correctly enforced `IsAdminUser`, but their corresponding detail endpoints (`IntegrationApiKeyDetailView` and `TeamMemberDetailView`) relied on the default `IsAuthenticated` permission, allowing any logged-in user to modify or delete settings.
**Learning:** Django REST Framework does not automatically inherit permissions from related list views. Each view must independently declare its permission classes.
**Prevention:** Always verify and mirror permission definitions across both collection and detail views for the same resource.
