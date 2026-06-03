## 2024-05-18 - Prevent Credential Leakage in DRF Serializers
**Vulnerability:** The `SystemSettingsSerializer` exposed sensitive fields like `smtp_password` in plaintext during API read responses.
**Learning:** By default, Django Rest Framework's `ModelSerializer` exposes all fields listed in `fields` for both reading and writing. When dealing with sensitive data like passwords or tokens, failing to explicitly mark them as `write_only` leaks credentials to any authenticated user capable of reading the resource.
**Prevention:** Always configure `extra_kwargs = {'<field_name>': {'write_only': True}}` within the `Meta` class of DRF serializers for any sensitive credentials. This ensures the data can be updated but is never returned in API responses.
