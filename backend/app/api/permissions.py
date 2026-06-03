from rest_framework.permissions import BasePermission
from app.settings_app.models import IntegrationApiKey

class HasAPIKey(BasePermission):
    """
    Allows access only to clients with a valid and active integration API key.
    """

    def has_permission(self, request, view):
        # Retrieve the key from the request headers
        api_key = request.META.get('HTTP_API_KEY')
        if not api_key:
            return False

        # Verify the key in the database
        try:
            key_instance = IntegrationApiKey.objects.get(key_value=api_key)
            return key_instance.is_active
        except IntegrationApiKey.DoesNotExist:
            return False
