## 2026-05-02 - Dynamic Notification Badge ARIA Pattern
**Learning:** Hardcoding dynamic values (like notification counts) into static `aria-label` attributes creates a disconnect for screen readers when the value changes.
**Action:** Use an `sr-only` class alongside visual badges to provide screen-reader text that stays synchronized with dynamic data.
