## 2024-06-05 - Plaintext Password Exposure in API Responses
**Vulnerability:** The `SystemSettingsSerializer` includes `smtp_password` in its fields but does not explicitly mark it as `write_only`, causing the password to be exposed in plaintext in the API response.
**Learning:** In Django Rest Framework (DRF), fields containing sensitive data (like passwords or secrets) must be configured with `extra_kwargs = {'<field_name>': {'write_only': True}}` to prevent them from being serialized back to the client, even if they are required for updates.
**Prevention:** Always use `extra_kwargs` with `write_only: True` for sensitive fields in `ModelSerializer` meta classes, or define them explicitly as `serializers.CharField(write_only=True)`.
