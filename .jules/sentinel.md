## 2024-05-24 - Django REST Framework Serializer Credential Exposure
**Vulnerability:** The `SystemSettingsSerializer` exposed the `smtp_password` field in plaintext responses, allowing anyone with API access to read sensitive credentials.
**Learning:** By default, DRF ModelSerializers will include all fields specified in `fields` in both read and write operations. Sensitive fields must be explicitly marked as write-only to prevent leakage.
**Prevention:** Always use `extra_kwargs = {'field_name': {'write_only': True}}` in the `Meta` class of serializers for sensitive fields (like passwords, keys, tokens) to ensure they can be updated but are never returned in API responses.
