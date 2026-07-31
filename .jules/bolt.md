## 2024-05-24 - N+1 Query in Django Time-Based Aggregations
**Learning:** Found N+1 query problems in `DashboardStatsView` and `AnalyticsView` where iterating over 24 hours to construct an `hourly_threat_data` array executes `logs_24h.filter(...).count()` repeatedly. This leads to roughly 3 queries per hour (72+ queries per request).
**Action:** Use database-native aggregation tools (like `annotate` and `Count`) in combination with dynamic `Count('id', filter=Q(...))` objects unpacked into a single `.aggregate(**aggregations)` call to resolve these N+1 queries.
