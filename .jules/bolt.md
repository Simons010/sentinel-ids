## 2024-08-08 - Fixing N+1 Queries in Time-Based Aggregations
**Learning:** When calculating hourly breakdown stats in this codebase, looping over hours and executing `.count()` for each bucket causes severe N+1 query problems (e.g., 72 queries for a 24-hour chart) and can lead to OOM regressions if fetched into memory.
**Action:** Build a dictionary of dynamic `Count('id', filter=Q(...))` objects and unpack it into a single `.aggregate(**aggregations)` call to force the database engine to execute the counting natively in one query.
