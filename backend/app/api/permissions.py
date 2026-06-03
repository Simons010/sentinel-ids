from rest_framework.permissions import BasePermission
from app.settings_app.models import IntegrationApiKey

class HasAPIKey(BasePermission):
    """
    Allows access only to requests with a valid API Key.
    """
    def has_permission(self, request, view):
        auth_header = request.META.get("HTTP_AUTHORIZATION", "")
        if auth_header.startswith("Bearer ") or auth_header.startswith("Api-Key "):
            token = auth_header.split(" ", 1)[1]
            return IntegrationApiKey.objects.filter(key_value=token, revoked_at__isnull=True).exists()
        return False
