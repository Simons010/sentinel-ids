## 2024-05-18 - Avoid aria-hidden on informative parents
**Learning:** Do not apply `aria-hidden="true"` to parent containers if they include informative text (like unread notification badges) as it hides important information from screen readers. Also, avoid hardcoding dynamic values into static `aria-label` attributes to prevent technical debt.
**Action:** Use visually hidden screen-reader only (`sr-only`) text alongside the visual elements to keep screen readers in sync, and apply `aria-hidden="true"` strictly to decorative elements like icons.
