## 2025-02-26 - Form Input Accessibility
**Learning:** Componentizing form fields without passing/generating explicit IDs creates widespread missing form associations, and icon-only utility buttons (like show/hide password) consistently lack screen-reader context if not explicitly labeled.
**Action:** Always pair `id` on inputs with `htmlFor` on labels, and mandate `aria-label` for any icon-only interactive elements in reusable components.
