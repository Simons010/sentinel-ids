## 2026-08-15 - Missing ARIA Labels on Icon-Only Buttons
**Learning:** Discovered a consistent pattern across several frontend components (Sidebar, Login, Register, Data Tables) where icon-only buttons lack `aria-label` attributes. This severely impacts screen reader accessibility.
**Action:** Added semantic `aria-label`s to these buttons and will make sure any future icon-only buttons introduced include appropriate labels from the start.
