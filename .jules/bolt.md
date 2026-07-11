## 2025-02-28 - Django QuerySet Evaluation Optimization
**Learning:** Performing multiple `.count()` calls on a Django QuerySet executes a separate SQL query for each call (e.g., evaluating True Positives, True Negatives, etc.). This causes unnecessary N+1 query performance bottlenecks.
**Action:** Consolidate multiple sequential `.count()` queries on the same queryset into a single `.aggregate()` call using conditional `Count` and `Q` objects to retrieve all metrics in one database hit.
