## 2024-06-19 - Consolidating count queries
**Learning:** Found N+1 query problem where multiple `.count()` queries were being run on the same table for different conditions, causing unnecessary database operations. This app uses `.count()` sequentially on the same queryset in multiple places.
**Action:** Replace sequential `.count()` calls on the same queryset with a single `.aggregate()` call using conditional `Count` and `Q` objects. This reduces multiple database queries to a single query.
