## 2024-05-24 - Missing Authentication on API Endpoints
**Vulnerability:** Several user-facing API endpoints in the Django backend lacked explicit authentication checks due to the absence of `DEFAULT_PERMISSION_CLASSES` in the DRF settings.
**Learning:** DRF views fall back to `AllowAny` if no default permissions are set. Even internal or obscure endpoints require explicit `IsAuthenticated` permissions to prevent unauthorized data access.
**Prevention:** Always verify DRF settings for global defaults and explicitly declare `permission_classes` on every new user-facing `APIView`. Ensure automated ingest endpoints remain separate from user auth mechanisms.
