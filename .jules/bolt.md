## 2024-05-24 - N+1 Queries in Frequency Distribution APIs
**Learning:** In Django APIs returning frequency distributions (like `ThreatsStatsView` calculating counts per severity), iterating through expected keys and calling `.filter().count()` creates hidden N+1 query patterns. This scales poorly as the number of keys increases.
**Action:** Always replace these iterative loops with a single database aggregation using `.values('field').annotate(count=Count('field')).order_by()`. Pre-initialize the result dictionary with all expected keys set to zero to ensure consistent API responses.
