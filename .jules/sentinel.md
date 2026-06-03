## 2024-05-10 - Hardcoded Authorization Bypass
**Vulnerability:** Found a hardcoded authorization bypass in `IsD3fau1t` permission class in `backend/app/auth_app/views.py` that granted admin access to any authenticated user with the username "d3fau1t", bypassing proper role-based access controls (RBAC) and allowing a backdoor.
**Learning:** Hardcoded credentials or backdoors even for administrative or testing purposes present a critical security risk. They bypass intended security architecture and could be discovered and abused.
**Prevention:** Implement and rely on established Role-Based Access Control (RBAC) mechanisms. Check user roles or specific privileges (e.g., `is_superuser` or `role == "admin"`) instead of relying on specific usernames.
