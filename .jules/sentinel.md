## 2024-05-11 - Securing Automated Endpoints and Preventing Credential Leakage in DRF
**Vulnerability:**
1. The machine-to-machine `LogIngestView` endpoint allowed unauthenticated requests (`AllowAny`), exposing it to abuse (CRITICAL).
2. The `SystemSettingsSerializer` exposed the `smtp_password` in plaintext API responses (HIGH).

**Learning:**
1. In DRF, when `DEFAULT_PERMISSION_CLASSES` is set to `IsAuthenticated`, we still need to apply proper custom API Key permissions (e.g., `HasAPIKey` mapping `HTTP_API_KEY` header to `IntegrationApiKey` instances) for automated ingest, since standard user sessions or default configurations don't apply or were mistakenly circumvented using `AllowAny`.
2. Model fields containing secrets or passwords must be explicitly excluded from DRF read outputs, even for Admin-only APIs.

**Prevention:**
1. Always use a dedicated custom Permission class like `HasAPIKey` for machine-to-machine APIs instead of removing all permissions (`AllowAny`).
2. Use `extra_kwargs = {'field_name': {'write_only': True}}` in `serializers.ModelSerializer` configurations for sensitive fields like passwords, API tokens, or secrets.
