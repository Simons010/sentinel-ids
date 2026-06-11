## 2024-05-15 - [Initial Sentinel Setup]

## 2024-05-15 - [Exposed SMTP Password in API]
**Vulnerability:** The `smtp_password` field in `SystemSettingsSerializer` was included in the API response without being marked as `write_only`, leaking credentials to anyone with access to the settings API endpoint.
**Learning:** By default, Django Rest Framework's `ModelSerializer` will serialize and expose all fields listed in `Meta.fields` as both read and write, even if they are sensitive credentials like passwords.
**Prevention:** To prevent credential leakage in DRF APIs, sensitive fields (like `smtp_password` in `SystemSettingsSerializer`) must be explicitly configured with `extra_kwargs = {'<field_name>': {'write_only': True}}` in the inner `Meta` class to ensure they can be updated but are never exposed in plaintext responses.
