## 2024-06-03 - Hardcoded Authorization Bypass Removal
**Vulnerability:** Authorization checks in `IsD3fau1t` and the React frontend used a hardcoded fallback username check (`d3fau1t`) instead of standard role-based properties.
**Learning:** Hardcoding usernames for admin checks creates severe authorization bypass vulnerabilities and architectural brittleness across both backend and frontend layers.
**Prevention:** Always use proper role-based access control properties, such as `is_superuser` or `role === 'admin'`, for permission boundaries across the application stack.
