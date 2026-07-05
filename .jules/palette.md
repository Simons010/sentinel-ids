## 2026-07-05 - FileUploadArea Accessibility Improvements
**Learning:** Custom drag-and-drop file upload zones often lack keyboard accessibility because they don't have focus states or ARIA roles, making them unusable for keyboard-only or screen reader users, despite having a hidden file input.
**Action:** Ensure custom drop zones are keyboard focusable using `tabIndex={0}`, handle keyboard events (like Enter/Space) to trigger the hidden file input, and provide clear focus styles (`focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-[#22D3EE]`).
