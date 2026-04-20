## 2024-04-20 - Dynamic Accessibility in Action Badges

**Learning:** When badges have dynamic content like unread notification counts, applying `aria-label` on the parent button can lead to disjointed screen reader experiences because static `aria-label` text can't easily reflect changing values. Furthermore, `aria-label` completely overrides visible text which can be problematic.

**Action:** Inject a visually hidden `sr-only` text span next to dynamic visual elements (like a badge count) so screen readers accurately read the updated number and its context (e.g., "7 unread notifications") synchronously with visual changes.
