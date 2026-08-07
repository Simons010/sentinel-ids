## 2024-11-20 - Fix N+1 Query in Time-based Aggregations
**Learning:** Found critical N+1 query problem in `DashboardStatsView` and `AnalyticsView` where iterating over 24 hours and calling `.count()` in a loop caused 72 separate queries. The specific learning here is that time-based aggregations require single query batching using Django's `Count` with `filter=Q(...)` for massive scale.
**Action:** Always batch counts using `aggregate()` and dynamic `Count` objects with `Q()` instead of python loops with `.count()` for time series data.
