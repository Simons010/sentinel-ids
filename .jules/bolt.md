## 2024-04-29 - Django ORM N+1 Count Queries Pattern
**Learning:** Sequential `.count()` queries on the same filtered QuerySet cause significant performance bottlenecks due to multiple database network roundtrips.
**Action:** Always combine multiple counting aggregations into a single `.aggregate(Count('id', filter=Q(...)))` call when possible.
