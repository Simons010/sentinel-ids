from rest_framework.permissions import BasePermission
from app.settings_app.models import IntegrationApiKey

class HasAPIKey(BasePermission):
    """
    Allows access only to requests with a valid, active API key.
    """
    def has_permission(self, request, view):
        api_key = request.META.get('HTTP_API_KEY')
        if not api_key:
            return False

        try:
            key = IntegrationApiKey.objects.get(key_value=api_key)
            return key.is_active
        except IntegrationApiKey.DoesNotExist:
            return False
