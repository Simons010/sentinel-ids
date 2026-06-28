## 2024-05-24 - N+1 Queries in Dashboard and Analytics

**Learning:** Running multiple `.count()` queries sequentially on the same queryset with different filters triggers redundant full table scans and database hits (an N+1 pattern). This is a common performance bottleneck specific to Django ORM usage in this codebase's analytics features.

**Action:** Consolidate multiple `.count()` operations on the same queryset into a single `.aggregate()` call using conditional `Count` and `Q` objects to perform all counting in a single database query.