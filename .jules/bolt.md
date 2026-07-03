## 2026-07-03 - Optimize multiple .count() queries
**Learning:** To optimize Django database performance and avoid redundant table scans (N+1 queries), consolidate multiple sequential `.count()` queries on the same queryset into a single `.aggregate()` call using conditional `Count` and `Q` objects.
**Action:** Always check for multiple sequential `.count()` calls on the same queryset and refactor them to use `.aggregate()` with conditional counts.
