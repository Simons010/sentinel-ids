## 2026-05-27 - Context-Aware ARIA Labels on Table Action Buttons
**Learning:** Icon-only action buttons inside mapped data tables (like `UploadHistoryTable`) require dynamic context in their `aria-label` (e.g., "Delete " + item.filename) to prevent screen readers from announcing multiple indistinguishable "Delete" buttons on the same page.
**Action:** Always append identifying row data to ARIA labels for icon buttons in lists or tables, and ensure inner SVG icons have `aria-hidden="true"` to prevent redundant reading.
