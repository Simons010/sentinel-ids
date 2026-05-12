## 2024-05-07 - Avoid Dynamic Values in `aria-label` Attributes
**Learning:** Adding dynamic values (like unread notification counts) to static `aria-label` strings can cause screen readers to fall out of sync or improperly read state changes.
**Action:** Instead of embedding dynamic values in `aria-label` or relying solely on a tooltip, inject visually hidden text using an `sr-only` class alongside visual badges. This ensures the screen reader is properly synchronized with dynamic data.
## 2026-05-12 - Contextual ARIA Labels for Icon-Only Buttons in Data Tables
**Learning:** Generic ARIA labels like "Delete" or "View" on icon-only buttons inside dynamic data tables or lists create ambiguity for screen reader users, making it difficult to understand which specific item an action applies to.
**Action:** Always append identifying context from the row's data to the ARIA label (e.g., `aria-label={"Delete " + item.filename}`) to ensure screen readers provide meaningful and specific context for each list item's actions.
