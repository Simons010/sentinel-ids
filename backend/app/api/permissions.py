from rest_framework.permissions import BasePermission
from app.settings_app.models import IntegrationApiKey

class HasAPIKey(BasePermission):
    def has_permission(self, request, view):
        api_key = request.META.get('HTTP_API_KEY')
        if not api_key:
            return False

        key_obj = IntegrationApiKey.objects.filter(key_value=api_key).first()
        return key_obj is not None and key_obj.is_active
