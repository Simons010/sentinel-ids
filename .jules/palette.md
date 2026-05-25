## 2026-05-25 - Contextual ARIA Labels for Data Table Actions
**Learning:** Icon-only action buttons within data tables require dynamic, contextual ARIA labels (e.g., using row data like `item.filename`) to be meaningful for screen reader users, rather than generic static labels. The inner icons should also be hidden with `aria-hidden='true'`.
**Action:** Always append identifying context from the row's data to the ARIA label and add focus-visible styles to ensure clear keyboard navigation.
