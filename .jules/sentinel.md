
## 2024-05-27 - Credential leakage in System Settings API
**Vulnerability:** SystemSettingsSerializer exposed the `smtp_password` field in plaintext responses, as it was missing a write-only restriction.
**Learning:** In Django REST Framework (DRF), any field included in `fields` that is read from the database will be included in the API response unless explicitly marked otherwise.
**Prevention:** Use `extra_kwargs = {'<field_name>': {'write_only': True}}` within the serializer's `Meta` class for sensitive credentials to allow updating while preventing leakage in read endpoints.
