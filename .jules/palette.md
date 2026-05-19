## 2024-05-07 - Avoid Dynamic Values in `aria-label` Attributes
**Learning:** Adding dynamic values (like unread notification counts) to static `aria-label` strings can cause screen readers to fall out of sync or improperly read state changes.
**Action:** Instead of embedding dynamic values in `aria-label` or relying solely on a tooltip, inject visually hidden text using an `sr-only` class alongside visual badges. This ensures the screen reader is properly synchronized with dynamic data.
## 2024-05-19 - Accessible Icon-Only Actions in Data Tables
**Learning:** In data tables with icon-only action buttons (like delete or view), omitting identifying row context from the `aria-label` creates ambiguity for screen reader users when navigating by buttons. Providing focus states with `focus-visible` also greatly improves keyboard navigation visibility.
**Action:** Always append identifying row data to `aria-label` attributes on icon-only table actions (e.g., `aria-label={"Delete " + item.filename}`). Add `aria-hidden="true"` to the inner SVG to avoid redundant reads, and include `focus-visible:outline-none focus-visible:ring-2` to ensure clear keyboard focus styling.
