## 2024-05-19 - N+1 and Memory Issue in Django Grouping
**Learning:** When addressing N+1 query problems in time-based aggregations (e.g., in `AnalyticsView` hourly threat data), pulling high-volume datasets (like `NetworkLog`) into Python memory using `.values()` and looping causes severe Out-Of-Memory (OOM) regressions and huge latency overheads.
**Action:** Always prioritize database-native aggregation tools (like `.annotate()` combined with `Count` and `Q` objects) for large datasets. Avoid retrieving individual log entries for manual iteration in Python.
