## 2024-08-05 - Added dynamic aria-labels to icon-only buttons
**Learning:** Found an accessibility pattern where icon-only action buttons in user list components lack specific context for screen readers. Using `title` attributes alone isn't enough, we need dynamic `aria-label`s that reference the user name to give context to actions.
**Action:** Always include a context-specific `aria-label` (e.g. `Reject user ${user.username}`) and `aria-hidden="true"` on the SVG icon when building list items with icon-only action buttons.
