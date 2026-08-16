## 2024-05-24 - Form Field Decoupling
**Learning:** Identified a pattern where reusable Input components lacked `htmlFor`/`id` linking between `label` and `input` elements, and lacked ARIA labels on utility icon buttons like password toggles. This negatively impacts screen reader users heavily.
**Action:** Always ensure custom wrapper components link `label` and `input` via `id` and `htmlFor`, and add `aria-label` to visually implied icon buttons.
