## 2024-07-06 - Consolidating Sequential Database Counts
**Learning:** Performing multiple `.count()` queries on the same Django queryset (like `annotated_logs.filter(...).count()`) results in multiple separate database table scans. This is an N+1 query problem variant that degrades performance on large datasets.
**Action:** When needing multiple counts with different conditions on the same dataset, consolidate them into a single query using `.aggregate()` with conditional `Count` and `Q` objects to evaluate all conditions in a single database pass.
