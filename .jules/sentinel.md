## 2024-05-17 - Hardcoded Admin Credentials in Initialization Script
**Vulnerability:** Found hardcoded default admin username (`d3fau1t`), email (`admin@sentinel.ids`), and password (`d3fau1t_Password!2026`) in `backend/app/auth_app/management/commands/create_default_admin.py`.
**Learning:** Hardcoding default credentials in initialization scripts is a critical vulnerability as it leads to insecure default deployments and predictable credentials if not manually changed by the administrator.
**Prevention:** Initialization scripts must require explicit configuration via environment variables (e.g., `DJANGO_SUPERUSER_USERNAME`, `DJANGO_SUPERUSER_EMAIL`, `DJANGO_SUPERUSER_PASSWORD`) and raise an error (`CommandError`) if they are missing.
