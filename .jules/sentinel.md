## 2025-02-14 - Prevent Credential Leakage in DRF Serializers
**Vulnerability:** The `SystemSettingsSerializer` exposed the `smtp_password` field in plaintext via the API response because it lacked explicit write-only configuration.
**Learning:** In Django REST Framework, sensitive fields included in the `fields` list of a `ModelSerializer` are implicitly exposed as read/write unless explicitly constrained. If not configured correctly, this results in credential leakage on read requests.
**Prevention:** Always explicitly define `extra_kwargs = {'field_name': {'write_only': True}}` within the `Meta` class of `ModelSerializer`s for any sensitive credentials like passwords, tokens, or private keys to ensure they can be updated via the API but are never returned in responses.
