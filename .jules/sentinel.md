## 2024-05-18 - [CRITICAL] Hardcoded Admin Authorization Bypass

**Vulnerability:** Authorization checks were hardcoded to check for a specific username `d3fau1t` rather than the `is_superuser` role.

**Learning:** Hardcoded authentication identifiers allow privilege escalation/bypass if the default username is known or unchanged.

**Prevention:** Always use role-based access control properties (like `is_superuser` or `role === 'admin'`) instead of hardcoded usernames.
