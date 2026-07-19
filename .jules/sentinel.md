## 2026-07-19 - Fix Insecure Direct Object Reference (IDOR) on multiple API endpoints

**Vulnerability:** Found missing `IsAdminUser` permission classes on `ReportDownloadView`, `IntegrationApiKeyDetailView`, and `TeamMemberDetailView` endpoints, potentially allowing any authenticated user to perform administrative actions.
**Learning:** Default permissions might not be sufficient for sensitive object-level actions. Relying only on list view protections is dangerous if detail views aren't similarly secured.
**Prevention:** Always ensure detail views have the same (or stricter) permission classes as their corresponding list views, especially for administrative functionalities.