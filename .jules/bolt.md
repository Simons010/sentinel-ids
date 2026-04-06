## 2026-04-06 - Optimized Heatmap Data Generation using TruncDate and ExtractHour
**Learning:** The dashboard statistics page previously had an N+1 query problem due to a loop iterating 168 times (7 days * 24 hours) querying the database for a count on each iteration.
**Action:** Replaced the loop with a single aggregation query using `TruncDate` and `ExtractHour` with `annotate(count=Count('id'))` and utilized `collections.defaultdict` for O(1) dictionary lookups in memory to map the counts to the exact heatmap array. Reduced query count from 168 to 1.
