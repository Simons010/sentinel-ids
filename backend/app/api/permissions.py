from rest_framework import permissions
from app.settings_app.models import IntegrationApiKey

class HasAPIKey(permissions.BasePermission):
    """
    Allows access only to requests containing a valid Integration API Key.
    """
    def has_permission(self, request, view):
        api_key = request.META.get('HTTP_API_KEY')
        if not api_key:
            return False
        key = IntegrationApiKey.objects.filter(key_value=api_key).first()
        return key is not None and key.is_active
