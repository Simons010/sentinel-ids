## 2025-02-14 - Add authentication checks to DRF API Views
**Vulnerability:** Django REST Framework API views were missing explicit `permission_classes = [IsAuthenticated]` checks, making sensitive endpoints publicly accessible.
**Learning:** The project's DRF settings (`backend/backend/settings.py`) lack a global `DEFAULT_PERMISSION_CLASSES` fallback. This means all API endpoints default to unrestricted access unless authentication is explicitly configured per view.
**Prevention:** Always verify that explicit `permission_classes` exist on DRF views and consider setting a secure default `DEFAULT_PERMISSION_CLASSES: ['rest_framework.permissions.IsAuthenticated']` in `settings.py` for new Django projects.
