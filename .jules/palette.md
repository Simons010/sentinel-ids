## 2024-05-07 - Avoid Dynamic Values in `aria-label` Attributes
**Learning:** Adding dynamic values (like unread notification counts) to static `aria-label` strings can cause screen readers to fall out of sync or improperly read state changes.
**Action:** Instead of embedding dynamic values in `aria-label` or relying solely on a tooltip, inject visually hidden text using an `sr-only` class alongside visual badges. This ensures the screen reader is properly synchronized with dynamic data.
## 2024-05-16 - Contextual Action Buttons
**Learning:** Adding focus states and dynamic `aria-label`s to data table action buttons (e.g. edit, delete) is essential for keyboard navigation and screen reader users to understand the context of the action.
**Action:** When creating data tables with actions, always ensure that each action button includes a clear, context-specific `aria-label` (like `aria-label={"Delete " + item.name}`) and visible focus styles.
