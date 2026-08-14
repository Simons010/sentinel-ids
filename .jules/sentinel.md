## 2024-05-30 - Missing Authorization on Admin Detail Views
**Vulnerability:** Found missing `IsAdminUser` permission classes on `IntegrationApiKeyDetailView` and `TeamMemberDetailView` while their corresponding list views were protected. This allows IDOR and unauthorized modifications by any authenticated user.
**Learning:** In Django REST Framework, permission classes applied to a list view do not automatically cascade or apply to separate detail views handling individual objects.
**Prevention:** Always explicitly define `permission_classes` on every view class, especially when dealing with sensitive operations like `patch` and `delete` on detail views.
