## 2024-08-10 - IDOR in APIView Detail Endpoints
**Vulnerability:** `IntegrationApiKeyDetailView` and `TeamMemberDetailView` were missing `permission_classes = [IsAdminUser]`. Because they inherit from `APIView` and lack a custom `permission_classes` assignment, they fall back to the default `IsAuthenticated`.
**Learning:** Detail endpoints in Django REST Framework do not automatically inherit permissions from their corresponding list views. They must be explicitly secured, especially when the models do not use object-level filtering (like an `organization` field).
**Prevention:** Always explicitly define `permission_classes` on every view class, even if a related list view is already secured.
