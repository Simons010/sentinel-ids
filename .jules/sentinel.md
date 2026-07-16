## 2024-10-24 - Missing Admin Authorization on Detail Views
**Vulnerability:** IDOR vulnerability due to missing `permission_classes = [IsAdminUser]` on detail endpoints (`IntegrationApiKeyDetailView` and `TeamMemberDetailView`), allowing any authenticated user to perform administrative actions.
**Learning:** Django REST Framework defaults to `IsAuthenticated`, which does not protect detail views that inherit from `APIView` unless explicitly overridden. This is a common oversight when copying list views that correctly implement permissions.
**Prevention:** Always explicitly declare `permission_classes` on every view, especially detail views handling sensitive or administrative data. Implement automated security linting to flag views missing explicit permission classes.
