## 2024-05-24 - Missing context in data table action buttons
**Learning:** Data tables across the application (e.g., UploadHistory, RecentAlerts) consistently rely on tooltip `title` attributes for icon-only action buttons but omit screen-reader contextual `aria-label`s and keyboard `focus-visible` styles.
**Action:** When reviewing or creating new data tables, explicitly verify that repeating row actions use dynamic identifiers (like filename or ID) in their `aria-label`s and include `focus-visible` rings.
