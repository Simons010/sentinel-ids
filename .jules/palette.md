## 2024-07-25 - Accessible File Upload Dropzone
**Learning:** Hiding file inputs with `display: none` (`hidden` class) completely removes them from the accessibility tree, making it impossible for keyboard users to navigate to the upload button via tab.
**Action:** Use `sr-only` to visually hide the input while keeping it focusable, place it immediately before its visual `<label>` trigger, and use Tailwind's `peer-focus-visible` on the label to show clear focus state for keyboard navigation.
