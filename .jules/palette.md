## 2024-06-25 - Using screen-reader only classes for dynamic states
**Learning:** Hardcoding dynamic values (like unread notification counts) into static `aria-label` attributes is an anti-pattern. Instead, injecting visually hidden screen-reader only (`sr-only`) text alongside the visual elements works best to keep screen readers in sync with dynamic data.
**Action:** Use `<span className="sr-only"> unread</span>` (or similar) combined with the dynamic value instead of updating an `aria-label` attribute on the parent button.
