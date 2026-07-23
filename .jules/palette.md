## 2024-07-23 - Accessible Icon Buttons in Table Rows
**Learning:** Table row actions often rely on `group-hover` for visual feedback. Screen reader and keyboard users miss this visual cue unless paired with explicit `aria-label`s and `group-focus-visible`/`focus-visible` styles.
**Action:** Always pair `group-hover:text-[COLOR]` on icons with `group-focus-visible:text-[COLOR]`, and apply `focus-visible:ring-2 focus-visible:outline-none` (with the appropriate ring color) to the parent button.
