## 2024-05-24 - Optimize N+1 Queries in Time-based Aggregations
**Learning:** In Django, executing `count()` inside a loop for time-based metrics causes severe N+1 query performance degradation.
**Action:** Build a dictionary of dynamic `Count('id', filter=Q(...))` objects and unpack it into a single `.aggregate(**aggregations)` call to execute all counting in a single database query.
