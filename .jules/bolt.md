## 2024-05-07 - Combine sequential count queries
**Learning:** Combining sequential `.count()` queries on the same Django queryset into a single `.aggregate()` query using `Count('id', filter=Q(...))` reduces database network roundtrips and overhead.
**Action:** Always prefer a single `aggregate` call over multiple sequential `count` or `aggregate` calls for the same base queryset when calculating multiple independent counts.
