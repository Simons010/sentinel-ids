
## 2024-05-28 - Accessible Focus States for List Actions
**Learning:** In list-based interfaces where actions apply to specific items (like approving/rejecting a user in a row), generic ARIA labels like "Approve" or "Reject" are insufficient for screen readers because they lose context when navigated sequentially.
**Action:** Always append identifying context from the row's data to the ARIA label (e.g., `aria-label={"Approve user " + item.username}`) to ensure meaningful screen reader announcements.
