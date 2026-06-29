## 2024-06-29 - Consolidated Sequential .count() Queries
**Learning:** In the Django backend, evaluating model accuracy involves calculating true/false positives and negatives. Using multiple `.count()` calls on the same queryset (e.g., `annotated_logs.filter(...).count()`) results in multiple database table scans, leading to N+1 query-like performance degradation.
**Action:** Consolidate multiple sequential `.count()` queries on the same queryset into a single `.aggregate()` call using conditional `Count` and `Q` objects to minimize database roundtrips.
