## 2024-05-23 - Accessible File Upload Dropzones
**Learning:** Hiding file inputs with `display: none` (`hidden`) removes them from the accessibility tree, breaking keyboard navigation. Using `sr-only` keeps them focusable, but styling the visual trigger (like a label) requires the `peer` class.
**Action:** Always use `sr-only peer` on hidden file inputs, place them immediately before their visual `<label>`, and apply `peer-focus-visible:*` classes to the label to provide a clear focus state without creating a double-focus stop.
