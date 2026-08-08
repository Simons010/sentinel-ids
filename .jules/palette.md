## 2026-08-08 - Accessible Hidden File Inputs
**Learning:** Using className="hidden" on file inputs makes them entirely removed from the accessibility tree and completely inaccessible to keyboard navigation. Using className="sr-only peer" allows it to remain focusable by screen readers and keyboards.
**Action:** Always move the file input to be a direct sibling immediately preceding its visual trigger (such as a <label>), apply sr-only peer to the input, and use peer-focus-visible utility classes on the trigger to properly render visual focus states.
