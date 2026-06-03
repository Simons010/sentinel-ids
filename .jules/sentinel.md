## 2024-05-24 - Hardcoded Secret Key
**Vulnerability:** A hardcoded `DJANGO_SECRET_KEY` fallback was found in `backend/backend/settings.py`. If this key is exposed or used in production, it allows attackers to compromise session hijacking, cryptographic signing, and other critical security components in Django.
**Learning:** Hardcoded fallback values are often used for convenience in development environments but risk exposing the application to attack if the environment variable is not set correctly in production.
**Prevention:** Remove the hardcoded fallback from the codebase and instead raise an `ImproperlyConfigured` error if the key is missing from environment variables, ensuring that a secure value must be provided for the application to start.
