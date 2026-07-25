## 2024-07-25 - IDOR in Detail API Views
**Vulnerability:** Django REST Framework detail views (like `ReportDownloadView` and `IntegrationApiKeyDetailView`) lacked explicit permission declarations, defaulting to `IsAuthenticated`, allowing any logged-in user to access administrative actions via IDOR.
**Learning:** In DRF, detail API views do not automatically inherit permissions from their corresponding list views. Even if `IntegrationApiKeysView` restricts access to `IsAdminUser`, its detail view will be vulnerable if not explicitly secured.
**Prevention:** Always explicitly declare `permission_classes` on every view class, regardless of whether a related view has permissions set, to ensure consistent access control and prevent IDOR.
