## 2025-05-15 - Contextual ARIA labels in Data Tables
**Learning:** Icon-only buttons within data tables require dynamic ARIA labels referencing the row's specific item (e.g., "Delete logs for file.csv"). Using a static "Delete" label results in repetitive, contextless screen reader announcements across multiple rows.
**Action:** Always interpolate unique row identifiers (like filename or title) into `aria-label` attributes for repeatable action buttons in lists and tables.
