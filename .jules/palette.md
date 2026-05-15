## 2024-05-07 - Avoid Dynamic Values in `aria-label` Attributes
**Learning:** Adding dynamic values (like unread notification counts) to static `aria-label` strings can cause screen readers to fall out of sync or improperly read state changes.
**Action:** Instead of embedding dynamic values in `aria-label` or relying solely on a tooltip, inject visually hidden text using an `sr-only` class alongside visual badges. This ensures the screen reader is properly synchronized with dynamic data.
## 2024-05-15 - Contextual ARIA Labels for Table Actions
**Learning:** Icon-only action buttons within data tables require context from the row's data (e.g., `aria-label={"Delete " + item.filename}`) to be meaningful for screen reader users, rather than generic static labels.
**Action:** Always append identifying row information to `aria-label` attributes for interactive elements inside lists or tables to ensure proper accessibility.
