## 2026-08-05 - Avoid N+1 queries in Django time-based aggregations
**Learning:** Fetching high-volume datasets into Python memory using `.values()` and loops for time-based aggregations (e.g. hourly stats) causes critical Out-Of-Memory (OOM) regressions and N+1 query problems.
**Action:** Always resolve N+1 query problems in time-based buckets by building a dictionary of dynamic `Count('id', filter=Q(...))` objects and unpacking it into a single `.aggregate(**aggregations)` call, pushing all conditional counting to the database in one query.
