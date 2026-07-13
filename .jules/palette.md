## 2024-05-09 - Accessible Icon Buttons in Tables
**Learning:** Found that icon-only action buttons in tables (like UploadHistoryTable) lacked ARIA labels and focus states, making keyboard navigation difficult and failing screen readers.
**Action:** Always add descriptive `aria-label`s (including dynamic context like filename when possible) and robust focus states (`focus-visible:ring-2 focus-visible:outline-none`) to icon-only buttons.
