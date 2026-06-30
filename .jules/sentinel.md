## 2026-06-30 - Remove hardcoded authorization bypass
**Vulnerability:** A hardcoded bypass existed in backend permissions and frontend UI checks for a specific username ("d3fau1t").
**Learning:** Relying on hardcoded usernames for administrative access introduces a severe privilege escalation risk if that username is registered by an attacker, and it violates the principle of least privilege.
**Prevention:** Always use role-based properties (like `is_superuser` or `role === 'admin'`) for authorization checks across both backend and frontend applications.
