## 2024-05-24 - DRF Serializer Credential Leakage Prevention
**Vulnerability:** Django REST Framework API endpoint for SystemSettings was leaking sensitive SMTP credentials (`smtp_password`) in plaintext API responses.
**Learning:** Default `ModelSerializer` exposes all included fields as both read and write unless explicitly configured otherwise. Simply adding a model field to `fields` list makes it available in the GET response.
**Prevention:** To prevent credential leakage in DRF APIs, sensitive fields (like `smtp_password` in `SystemSettingsSerializer`) must be configured with `extra_kwargs = {'<field_name>': {'write_only': True}}` to ensure they can be updated but are never exposed in plaintext responses.
