from rest_framework import permissions
from app.settings_app.models import IntegrationApiKey

class HasAPIKey(permissions.BasePermission):
    """
    Custom permission to check for a valid API Key.
    Expects header: Api-Key <key>
    """
    def has_permission(self, request, view):
        api_key_header = request.META.get('HTTP_API_KEY')
        if not api_key_header:
            return False

        try:
            key_obj = IntegrationApiKey.objects.get(key_value=api_key_header)
            return key_obj.is_active
        except IntegrationApiKey.DoesNotExist:
            return False
