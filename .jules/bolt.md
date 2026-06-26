## 2024-05-24 - Optimize sequential .count() queries with .aggregate()
**Learning:** Performing multiple independent `.count()` queries on the same annotated queryset (e.g., calculating TP/TN/FP/FN metrics sequentially) triggers redundant table scans, creating a performance bottleneck in the Django backend.
**Action:** Consolidate multiple `.count()` calls on the same queryset into a single `.aggregate()` call using conditional `Count` and `Q` objects. This reduces N+1 database queries to a single query.
