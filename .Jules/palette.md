## 2024-05-24 - Initial File Creation

## 2024-05-24 - Contextual ARIA Labels for Data Tables
**Learning:** For icon-only action buttons within data tables, simple `aria-label="Delete"` is insufficient. Screen readers lose context of which row is being acted upon.
**Action:** Always append identifying context from the row's data to the ARIA label (e.g., `aria-label={"Delete " + item.filename}`) to ensure screen readers provide meaningful context.
