## 2025-02-27 - Hardcoded d3fau1t User Authorization
**Vulnerability:** The application contains a hardcoded authorization check (`request.user.username == "d3fau1t"`) in `backend/app/auth_app/views.py` and `backend/app/api/views.py` that explicitly grants admin-level privileges (approving users, viewing pending users) to a specific username instead of relying on roles.
**Learning:** This is an architectural vulnerability where a specific user account is hardcoded with elevated privileges, bypassing the standard role-based access control (RBAC) system (which already exists, e.g., `IsAdminUser`).
**Prevention:** Always use role-based permissions (like checking if a user is a superuser or has an 'admin' role) instead of hardcoding specific usernames in authorization logic.
