## 2024-05-18 - Remove Hardcoded Admin Authorization Bypass

**Vulnerability:** A hardcoded username check (`request.user.username == "d3fau1t"`) in `IsD3fau1t` permission class and frontend component navigation bypasses standard role-based access control, allowing an attacker to gain admin privileges by registering or assuming this username.
**Learning:** Hardcoded username checks create dangerous backdoors and undermine robust authorization mechanisms.
**Prevention:** Always use dynamic, role-based properties (like `is_superuser` or `role === "admin"`) for authorization checks across both frontend and backend to ensure security scales and remains manageable.
