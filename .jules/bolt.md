
## 2024-05-14 - Optimize Dashboard Query Loops
**Learning:** The dashboard analytics endpoints in Django were executing over 150 individual `.count()` database queries by looping through Python ranges to gather hourly and daily timeseries data.
**Action:** Always replace Python iteration over database hits with single Django ORM aggregation queries. Utilize `.annotate()` with date truncations like `TruncHour` and conditional aggregations like `Count('id', filter=Q(...))` followed by `.order_by()` to eliminate N+1 latency.
