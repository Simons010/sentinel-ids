## 2024-05-18 - Added ARIA labels to icon-only action buttons
**Learning:** Found a pattern where icon-only buttons inside data tables (UploadHistoryTable) rely solely on title attributes, which are insufficient for robust screen reader support and lack visible focus states for keyboard navigation.
**Action:** Always verify icon-only buttons have explicit aria-label attributes (preferably with contextual information like the filename) and focus-visible styles when implementing tabular actions.
