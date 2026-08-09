## 2024-08-09 - Fix Missing Authorization on Detail Views
**Vulnerability:** Detail views (e.g. `IntegrationApiKeyDetailView`, `TeamMemberDetailView`) lacked the `permission_classes = [IsAdminUser]` check that was present on their list-view counterparts.
**Learning:** In Django REST Framework, setting permissions on list endpoints does not automatically cascade to separate detail endpoint classes. Missing permissions on detail views can result in Insecure Direct Object Reference (IDOR) / authorization bypass where an authenticated user could delete or modify objects intended only for admins.
**Prevention:** Always explicitly define `permission_classes` on all view classes handling sensitive objects, or use ViewSets where permissions apply uniformly across actions.
