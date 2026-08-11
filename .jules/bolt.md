## 2024-08-11 - Fixed N+1 Query in Time-based Aggregations
**Learning:** Found N+1 query problem where `DashboardStatsView` and `AnalyticsView` performed 70+ SQL queries to calculate hourly data by running `.filter().count()` inside a 24-iteration `for` loop. Fetching datasets using `.values()` and looping over them in Python memory causes Out-Of-Memory regressions.
**Action:** Used database-native aggregation dynamically unpacking a dictionary of `Count(..., filter=Q(...))` expressions into a single `.aggregate(**aggregations)` query.
