## 2024-05-19 - Screen Reader Sync with Dynamic Counts
**Learning:** For interactive elements with dynamic text (like unread notification badges), hardcoding dynamic values into static `aria-label` attributes causes screen readers to fall out of sync with visual changes.
**Action:** Use `.sr-only` (visually hidden) text alongside the visual count element within the button, ensuring the screen reader always announces the up-to-date, real-time context.
