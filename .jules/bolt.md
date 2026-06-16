## 2024-06-16 - Consolidating .count() queries on annotated querysets
**Learning:** Performing multiple independent `.count()` queries on the same annotated queryset (e.g., calculating TP/TN/FP/FN metrics sequentially) triggers redundant table scans.
**Action:** Consolidate these into a single `.aggregate()` call using conditional `Count` and `Q` objects to improve database performance.