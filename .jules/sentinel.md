## 2024-05-24 - [Remove Hardcoded Credentials]
**Vulnerability:** Hardcoded default fallback credentials in `create_default_admin.py` and `docker-compose.yml` (e.g., `d3fau1t_Password!2026`).
**Learning:** Hardcoding credentials in source code or compose files, even as fallbacks, can lead to insecure default deployments and exposes sensitive data.
**Prevention:** Rely strictly on explicit environment variables for sensitive configuration and credentials, and fail securely if they are not provided.
