## 2026-06-24 - Remove Hardcoded Admin Credentials
**Vulnerability:** Default superuser credentials (`d3fau1t_Password!2026`) were hardcoded as fallback values in `create_default_admin.py`, `docker-compose.yml`, and `.env.example`. This could lead to insecure default deployments if environment variables are not explicitly set.
**Learning:** Fallback values in management commands and deployment configurations can easily become the defacto credentials in production if operators skip configuring the `.env` file, bypassing intended security controls.
**Prevention:** Remove fallback credentials entirely. Require explicit environment variables for sensitive setup scripts and fail explicitly if they are not provided, ensuring operators consciously set secure passwords.
