## 2024-07-19 - Avoid database N+1 bottleneck when grouping time series data

**Learning:**
The application builds a time series data array for "hourly threat data" in the DashboardStatsView and AnalyticsView by running separate `.count()` database queries for normal, suspicious, and confirmed alerts *for each of the 24 hours*. This is a textbook N+1 query problem, causing 72 distinct queries (24 hours x 3 categories). In environments where database features like `TruncHour` aren't fully supported due to missing timezone definitions (as noted in Sentinel constraints), it's far more efficient to fetch the limited dataset covering the 24-hour window using `.values()` and aggregate the groups in-memory using python.

**Action:**
When compiling time series aggregations over small sliding windows (like the last 24 hours), query the subset once and filter in-memory inside the iteration loop instead of executing N distinct `.count()` queries on the database.
