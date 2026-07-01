## 2024-07-01 - Icon-Only Table Action Buttons
**Learning:** The application's table components consistently use icon-only action buttons without ARIA labels, focus states, or `aria-hidden` attributes on the icons, making them inaccessible to screen readers and keyboard users.
**Action:** When working with table components, always explicitly add `aria-label`, `focus-visible:ring-2`, `focus-visible:outline-none`, and `aria-hidden="true"` to icon components to ensure accessibility compliance.
