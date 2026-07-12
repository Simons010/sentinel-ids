## 2024-05-18 - Missing IsAdminUser in DRF Detail Views leads to IDOR
**Vulnerability:** IDOR in API endpoints due to missing permission_classes in Detail Views (`IntegrationApiKeyDetailView` and `TeamMemberDetailView`), defaulting to `IsAuthenticated`.
**Learning:** Django REST Framework does not automatically inherit permissions from related ListViews. Detail Views must explicitly declare `permission_classes = [IsAdminUser]` to match the list views if administrative access is required.
**Prevention:** Always explicitly define `permission_classes` on every DRF view to prevent fallback to the default global permission (which is `IsAuthenticated` in this project).
