## 2026-07-08 - Consolidating Django ORM .count() calls

**Learning:** Sequential `.count()` queries on the same queryset in Django result in multiple database table scans (N+1 problem), creating a significant performance bottleneck, especially on large tables like `NetworkLog`.

**Action:** Consolidate multiple sequential `.count()` queries on the same queryset into a single `.aggregate()` call using conditional `Count` and `Q` objects to perform the aggregation in a single database query.
