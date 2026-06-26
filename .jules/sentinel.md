## 2025-02-23 - Hardcoded Authentication Bypass
**Vulnerability:** The application uses a hardcoded fallback username `d3fau1t` for admin permissions checks across both the Django backend and the React frontend.
**Learning:** Hardcoded authorization checks relying on a specific username bypass established role-based access controls and create a backdoor if an attacker can manipulate or assume that username.
**Prevention:** Authorization checks must always rely on role-based properties (like `is_superuser`, `is_staff`, or `role === 'admin'`) rather than checking for specific fallback usernames.
