## 2024-05-02 - Optimize sequential COUNT queries
**Learning:** In Django, executing multiple sequential `.count()` queries on the same queryset (e.g., to compute confusion matrices or anomaly splits) causes unnecessary database roundtrips and overhead.
**Action:** Use `.aggregate()` with `Count('id', filter=Q(...))` to combine these metrics into a single database query, significantly reducing latency and server load.
