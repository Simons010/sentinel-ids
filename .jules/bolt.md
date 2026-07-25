## 2025-07-25 - Fix N+1 Query in Time-Based Aggregations
**Learning:** In Django REST Framework, using loop-based `filter().count()` calls inside time-based aggregations (e.g., hourly data points over 24 hours) leads to N+1 query problems (72 separate queries).
**Action:** Replace looped `count()` queries with a single `.aggregate()` call using dynamic `Count` and `Q` objects to push the aggregation workload directly to the database.
