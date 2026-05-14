## 2024-05-07 - Avoid Dynamic Values in `aria-label` Attributes
**Learning:** Adding dynamic values (like unread notification counts) to static `aria-label` strings can cause screen readers to fall out of sync or improperly read state changes.
**Action:** Instead of embedding dynamic values in `aria-label` or relying solely on a tooltip, inject visually hidden text using an `sr-only` class alongside visual badges. This ensures the screen reader is properly synchronized with dynamic data.

## 2026-05-14 - Dynamic Row Context for Icon-Only Buttons in Data Tables
**Learning:** When using icon-only buttons in data tables, static `aria-label` attributes (e.g., "Delete") lack context, forcing screen reader users to rely on surrounding table context or guess which row the action applies to.
**Action:** Always append identifying context from the row's data to the `aria-label` (e.g., `aria-label={"Delete " + item.filename}`) to ensure meaningful and independent context for each action.
