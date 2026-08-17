## 2024-05-24 - Optimized Dashboard and Analytics Views
**Learning:** Resolving N+1 loops in time-based groupings using dynamic dictionary `aggregate(**kwargs)` calls avoids local timezone-related grouping issues and OOMs.
**Action:** Use conditional `Count` and `Q` objects in a single `.aggregate()` call instead of `TruncHour` for time-based groupings.
