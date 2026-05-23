## 2024-10-24 - API Response Credential Leakage in DRF Serializers
**Vulnerability:** The `SystemSettingsSerializer` was leaking the `smtp_password` field in plain text via the API response because it was not explicitly configured as write-only.
**Learning:** In Django REST Framework (DRF), fields containing sensitive credentials (like passwords or API keys) will be included in the serialized output by default unless explicitly protected. This can lead to severe credential exposure if these endpoints are accessible.
**Prevention:** Always configure sensitive fields with `extra_kwargs = {'<field_name>': {'write_only': True}}` within the serializer's `Meta` class. This ensures the credentials can be updated by authorized users but are never returned in read operations.
