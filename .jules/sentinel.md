## 2025-06-20 - [Hardcoded Credentials Removed]
**Vulnerability:** Found hardcoded fallback credentials (`d3fau1t_Password!2026` for superuser, `sentinel` for database) in code (`create_default_admin.py` and `settings.py`).
**Learning:** Hardcoding credentials, even as fallbacks, introduces significant risk if source code is exposed or deployed in environments where environment variables aren't strictly enforced.
**Prevention:** Always rely strictly on explicit environment variables for sensitive configuration; never embed them in the codebase.
