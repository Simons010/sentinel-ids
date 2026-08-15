## 2024-05-18 - Replacing O(n) Database Queries with Aggregation
**Learning:** In Django's ORM, looping over timespans (e.g. 24 hours) and querying the database in each loop iteration causes N+1 query performance problems (in this case 3 * 24 = 72 queries). The proper way is to use database native aggregation instead of filtering in memory or executing a query per loop.
**Action:** Use `TruncHour` coupled with `.annotate` and `Count` in order to let the database do the work, reducing queries from 72 down to ~2 for generating hourly time-series data.
