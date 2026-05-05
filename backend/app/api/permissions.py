from rest_framework.permissions import BasePermission
from app.settings_app.models import IntegrationApiKey

class HasAPIKey(BasePermission):
    """
    Allows access only to requests with a valid API Key.
    """
    def has_permission(self, request, view):
        api_key = request.META.get('HTTP_API_KEY')
        if not api_key:
            return False

        try:
            key_obj = IntegrationApiKey.objects.get(key_value=api_key)
            return key_obj.is_active
        except IntegrationApiKey.DoesNotExist:
            return False
