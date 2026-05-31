## 2024-05-31 - Add ARIA label to TeamMemberRow remove button
**Learning:** Icon-only action buttons within data tables require context from the row's data in the ARIA label (e.g., `aria-label={"Remove " + member.name}`) to ensure screen readers provide meaningful context instead of generic "Remove" actions.
**Action:** Always append identifying context from the row's data to the ARIA label for icon-only action buttons.
