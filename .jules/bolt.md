## 2024-05-18 - Optimize TP/TN/FP/FN queries
**Learning:** Performing multiple independent `.count()` queries on annotated querysets triggers redundant table scans.
**Action:** Consolidate multiple count queries into a single `.aggregate()` call using conditional `Count` and `Q` objects to improve database performance.