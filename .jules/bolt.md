## 2024-05-24 - Resolving N+1 Time-Based Aggregation
**Learning:** Found N+1 query problem in Django calculating time-based buckets. Loop-based `.count()` issues repeated database queries resulting in slow performance.
**Action:** Build a dictionary of dynamic `Count('id', filter=Q(...))` objects and unpack it into a single `.aggregate(**aggregations)` call. This pushes all conditional counting to the database in one query.
