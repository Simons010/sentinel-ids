## 2024-05-15 - SMTP Password Leakage in API Response
**Vulnerability:** The `SystemSettingsSerializer` exposed the `smtp_password` field in plaintext responses, as it was included in `fields` but lacked restrictions.
**Learning:** In DRF, standard `ModelSerializer` fields will be both readable and writable by default. Sensitive fields must be explicitly marked as write-only to prevent leakage in API responses while still allowing updates.
**Prevention:** Always use `extra_kwargs = {'field_name': {'write_only': True}}` in the serializer's `Meta` class for sensitive configuration fields (like passwords, keys, and tokens) or use `serializers.CharField(write_only=True)` when declaring fields manually.
