## 2024-05-19 - Adding Focus Indicators to Icon-Only Buttons
**Learning:** In the `TopBar` component, many icon-only buttons (like the Notification Bell and User Profile) lacked distinct keyboard focus indicators, making them difficult for screen reader and keyboard-only users to navigate.
**Action:** Always ensure that interactive elements have a clear `focus-visible` outline. I successfully applied `focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-[#22D3EE]` to provide a visually distinct and accessible focus state that aligns with the application's cyan branding.
