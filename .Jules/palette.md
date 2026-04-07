## 2026-04-07 - Keyboard Accessibility and ARIA Labels
**Learning:** Found a common pattern of icon-only interactive elements lacking proper `aria-label` descriptions and visible keyboard focus states (e.g., Notification Bell, Sidebar Toggle) which breaks screen reader usability and keyboard navigation.
**Action:** Always ensure interactive elements have a clear `aria-label` if they lack text content, and use `focus-visible:ring-2 focus-visible:outline-none` (with appropriate theme colors like `ring-[#22D3EE]`) to guarantee keyboard users can track their focus state.
