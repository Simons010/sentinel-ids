## 2024-05-23 - [N+1 Queries in Time-Series Data Aggregation]
**Learning:** Found a severe N+1 query bottleneck in `NetworkStatsView` where generating a 7-day hourly heatmap resulted in 168 separate database `count()` queries inside a nested loop.
**Action:** Use Django's `annotate()`, `TruncDate`, and `ExtractHour` to aggregate time-series data into a single query, then map the results into the required data structure using a dictionary lookup in Python.
