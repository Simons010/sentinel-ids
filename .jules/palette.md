## 2026-08-02 - Accessible hidden file inputs
**Learning:** Hidden file inputs (`className="hidden"`) are removed from focus order, preventing keyboard users from interacting with them. A reusable pattern in this app is using `sr-only peer` on the input immediately before its label trigger.
**Action:** Use `sr-only peer` on the input, place it before the visual trigger label, and apply `peer-focus-visible` to the label for accessible focus states.
