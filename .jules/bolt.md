## 2024-06-17 - Optimize Database Queries with Conditional Aggregation
**Learning:** Performing multiple independent `.count()` queries on the same queryset or annotated queryset triggers redundant table scans. In Django, calculating true positives, false positives, etc., sequentially creates multiple SQL queries.
**Action:** Consolidate multiple related `.count()` operations into a single query using `.aggregate()` with conditional `Count` and `Q` objects. This significantly reduces database load and speeds up query execution.
