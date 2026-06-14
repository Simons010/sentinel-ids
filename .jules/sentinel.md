## 2025-06-14 - Hardcoded Fallback Credentials

**Vulnerability:** The `create_default_admin.py` management command, `docker-compose.yml`, and environment configurations rely on hardcoded fallback credentials (e.g., `d3fau1t_Password!2026`) when environment variables are not provided. This can lead to insecure default deployments with known administrative credentials.

**Learning:** Hardcoded fallback credentials, even when intended for development or as defaults, pose a significant risk if deployed to production without explicit configuration.

**Prevention:** Ensure that administrative credentials and critical configuration values strictly require explicit environment variables and never fall back to hardcoded secrets.
