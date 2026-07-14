## 2024-05-24 - Hardcoded backdoor in permission classes
**Vulnerability:** A hardcoded backdoor permission class `IsD3fau1t` exists in `backend/app/api/views.py` and `backend/app/auth_app/views.py` which grants admin-level access (for user approvals) to any user with the username "d3fau1t".
**Learning:** This is a critical security vulnerability intentionally placed or left over from debugging/testing, allowing a specific hardcoded username to bypass standard role-based access controls and approve users, potentially creating unauthorized administrative access.
**Prevention:** Always use standard, centralized role-based access control (RBAC) like checking `is_superuser` or a profile's `role` attribute (`IsAdminUser`). Never hardcode usernames or credentials in permission logic.
