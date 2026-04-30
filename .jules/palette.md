## 2024-05-20 - Dynamic Badge Accessibility
**Learning:** Using static `aria-label`s on elements with dynamic content (like unread notification counts) creates technical debt and state desynchronization issues.
**Action:** Always use visually hidden `sr-only` text alongside dynamic badges inside interactive elements to ensure screen readers announce the exact current state.
