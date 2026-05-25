## 2024-05-24 - Credentials leakage in System Settings API
**Vulnerability:** The SystemSettingsSerializer exposes the `smtp_password` field in plaintext API responses.
**Learning:** Django REST framework serializers will by default expose model fields for both read and write unless configured otherwise, leading to sensitive credentials leaking.
**Prevention:** To prevent credential leakage in DRF APIs, sensitive fields (like `smtp_password`) must be explicitly configured with `extra_kwargs = {'<field_name>': {'write_only': True}}` in the serializer's `Meta` class.
