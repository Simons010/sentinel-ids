## 2024-05-24 - Combine sequential .count() queries
**Learning:** Sequential `.count()` queries on the same queryset in Django cause significant N+1-like performance bottlenecks due to unnecessary database network roundtrips.
**Action:** Always combine multiple `.count()` aggregations on the same model into a single database query using `.aggregate()` with `Count` and `Q` filters (e.g., `Count('id', filter=Q(...))`).
