## 2024-05-15 - [CRITICAL] Prevent Credential Leakage in Django REST Framework Serializers
**Vulnerability:** Sensitive fields, specifically `smtp_password` in `SystemSettingsSerializer`, were being serialized and exposed in plain text in the API response.
**Learning:** In Django REST Framework, fields included in a ModelSerializer will be both read and written. Without explicit configuration, sensitive fields from the database will be returned in GET requests, causing credential leakage.
**Prevention:** Always use `extra_kwargs = {"<field_name>": {"write_only": True}}` in the `Meta` class of serializers for sensitive fields (like passwords, keys, or tokens) to ensure they can be updated via the API but are never returned in responses.
