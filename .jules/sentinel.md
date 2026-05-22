## 2024-05-24 - Avoid Hardcoded Credentials in Management Commands
**Vulnerability:** Found hardcoded fallback default credentials (username, email, password) in `create_default_admin.py` when environment variables were not set.
**Learning:** Even internal management scripts or initial setup commands present a security risk if they default to known, hardcoded credentials when executed in an improperly configured environment.
**Prevention:** Always enforce the presence of required sensitive environment variables in setup scripts. Raise a `CommandError` (or equivalent) to fail securely rather than falling back to default values.
