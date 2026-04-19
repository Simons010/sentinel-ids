## 2024-11-20 - [Hardcoded Django Secret Key]
**Vulnerability:** The Django project was configured with a hardcoded `SECRET_KEY` fallback (`django-insecure-...`) in `backend/backend/settings.py`.
**Learning:** Hardcoded default secrets are a significant security risk, allowing attackers to forge sessions or perform cryptographic attacks if the environment variable `DJANGO_SECRET_KEY` is accidentally omitted in production.
**Prevention:** Instead of falling back to an insecure string, the application should raise `django.core.exceptions.ImproperlyConfigured` when a required security environment variable is missing to ensure a fail-secure state.
