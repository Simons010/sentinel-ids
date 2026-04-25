## 2024-05-24 - Screen-reader Only Text vs aria-label for Dynamic Content
**Learning:** Hardcoding dynamic values (like unread notification counts) into static `aria-label` attributes creates technical debt and inaccessible states when the UI updates.
**Action:** Use visually hidden text (e.g. `<span className="sr-only">7 unread notifications</span>`) alongside decorative visual badges instead of static `aria-label` attributes to ensure screen readers announce dynamic values accurately and synchronously.
