## 2024-05-24 - [Fix credential leakage in API response]
**Vulnerability:** The `SystemSettingsSerializer` exposed `smtp_password` in plaintext in API responses.
**Learning:** DRF serializers default to exposing all model fields in responses unless otherwise specified. Sensitive fields need explicit handling.
**Prevention:** Always set `extra_kwargs = {'<field>': {'write_only': True}}` for sensitive credentials (passwords, tokens, API keys) in DRF model serializers so they can be written/updated, but never read via the API.
