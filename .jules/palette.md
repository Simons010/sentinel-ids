## 2024-05-07 - Avoid Dynamic Values in `aria-label` Attributes
**Learning:** Adding dynamic values (like unread notification counts) to static `aria-label` strings can cause screen readers to fall out of sync or improperly read state changes.
**Action:** Instead of embedding dynamic values in `aria-label` or relying solely on a tooltip, inject visually hidden text using an `sr-only` class alongside visual badges. This ensures the screen reader is properly synchronized with dynamic data.
## 2024-05-18 - Add Context to Icon-Only Data Table Buttons
**Learning:** Icon-only action buttons in data tables often lack sufficient context for screen reader users, leading to ambiguity (e.g., hearing "Delete" multiple times without knowing which item it applies to).
**Action:** Always append identifying context from the row's data to the ARIA label (e.g., `aria-label={"Delete " + item.filename}`) to ensure screen readers provide meaningful context for each row action.
