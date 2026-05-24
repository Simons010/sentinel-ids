## 2024-05-24 - Contextual ARIA Labels for Table Actions
**Learning:** Icon-only action buttons within data tables require data-specific context in their `aria-label`s (e.g., "Delete [filename]") rather than generic labels like "Delete" to ensure screen readers can distinguish between actions for different rows.
**Action:** Always append identifying context from the row's data to the ARIA label for icon-only action buttons in data tables.
