from rest_framework import permissions
from app.settings_app.models import IntegrationApiKey

class HasAPIKey(permissions.BasePermission):
    """
    Allows access only to requests with a valid API key.
    """

    def has_permission(self, request, view):
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')

        if not auth_header or not auth_header.startswith('Api-Key '):
            return False

        key = auth_header.split(' ')[1]

        try:
            api_key = IntegrationApiKey.objects.get(key_value=key)
            return api_key.is_active
        except IntegrationApiKey.DoesNotExist:
            return False
