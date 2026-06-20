## 2024-06-20 - [Avoid Redundant Count Queries on Annotated Querysets]
**Learning:** Performing multiple independent `.count()` queries on the same annotated queryset (e.g., calculating TP/TN/FP/FN metrics sequentially) triggers redundant table scans, which can severely impact database performance.
**Action:** Consolidate multiple count queries on the same queryset into a single `.aggregate()` call using conditional `Count` and `Q` objects.
