## 2026-04-30 - Optimized Time-Series N+1 Queries
**Learning:** Aggregating time-series data using loop-based `.count()` queries results in severe N+1 bottlenecks (e.g., 72 queries for a 24-hour chart) when querying massive tables like `NetworkLog` and `Alert`.
**Action:** Always use database-level aggregation with `TruncHour` and `Count(filter=Q(...))` along with an empty `.order_by()` to clear default model ordering when dealing with calendar buckets.
