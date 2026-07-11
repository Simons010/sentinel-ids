## 2025-01-15 - Missing Detail View Authorization
**Vulnerability:** IDOR/Authorization bypass on IntegrationApiKeyDetailView and TeamMemberDetailView where IsAdminUser was missing on detail endpoints while present on list endpoints.
**Learning:** Django REST Framework does not automatically inherit permissions from related ListViews. Detail Views require explicit permission definitions.
**Prevention:** Always verify that Detail Views have corresponding authorization checks applied as their associated List/Create views.
