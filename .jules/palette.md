## 2024-05-23 - Dynamic ARIA labels for table actions
**Learning:** Icon-only action buttons in data tables consistently lack dynamic `aria-label`s, breaking screen reader context, and lack `focus-visible` styles, breaking keyboard navigation.
**Action:** Always add context-aware `aria-label`s (e.g., `aria-label={\`View \${item.name}\`}`) and apply `focus-visible:ring-2 focus-visible:outline-none focus-visible:ring-[BrandColor]` to interactive elements.
