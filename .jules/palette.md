## 2024-05-24 - App-Specific Focus State Pattern for Table Icon Buttons
**Learning:** This repository uses a specific convention for accessible icon buttons in tables: pairing `group-hover:text-[COLOR]` with `group-focus-visible:text-[COLOR]` on the child icon, alongside `focus-visible:ring-2 focus-visible:outline-none` on the parent button.
**Action:** Always apply this paired group-hover/focus-visible pattern when adding new icon-only buttons to maintain consistency in keyboard accessibility and visual feedback.
