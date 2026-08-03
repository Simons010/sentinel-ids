## 2024-05-15 - Accessible Hidden File Inputs
**Learning:** Hidden file inputs (`className="hidden"`) cannot receive keyboard focus, breaking accessibility for file uploads. A reusable pattern for this design system is required to maintain both the visual design and keyboard accessibility.
**Action:** To properly style visual focus states for accessible hidden file inputs using Tailwind CSS, use `className="sr-only peer"` on the input element, place it immediately preceding its visual trigger (such as a `<label>`), and apply `peer-focus-visible` utility classes to the trigger.
