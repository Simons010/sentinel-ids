## 2024-04-28 - Django ORM N+1 Counting Anti-Pattern
**Learning:** Found instances where the backend was using sequential `.count()` queries on the same queryset with different filters (e.g., in `AnalyticsView.get()`). This causes multiple separate database roundtrips for related data.
**Action:** When calculating multiple aggregations on the same dataset, always combine them into a single `.aggregate()` call using `Count('id', filter=Q(...))`. This reduces DB hits to exactly 1.
