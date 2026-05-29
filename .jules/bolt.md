## 2024-05-29 - [Optimizing N+1 queries in ThreatsStatsView]
**Learning:** When calculating frequency distributions or breakdowns in Django views, iteratively calling `.filter().count()` inside a loop (or list comprehension) executes an N+1 query pattern, which severely degrades performance as the dataset grows.
**Action:** Replace multiple `.filter().count()` queries with a single `.values('field').annotate(count=Count('field'))` query to aggregate data efficiently at the database level, avoiding multiple round-trips.
