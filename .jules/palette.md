## 2024-05-24 - Table Action Button Accessibility
**Learning:** Icon buttons in table rows frequently lack keyboard accessibility and screen reader support out-of-the-box in this application.
**Action:** Pair `group-hover:text-[COLOR]` with `group-focus-visible:text-[COLOR]` on icons, and apply `focus-visible:ring-2 focus-visible:outline-none` with proper ring colors on the parent button. Always add `aria-label` to icon-only buttons.
