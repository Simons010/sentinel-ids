## 2024-05-18 - Consolidating Sequential QuerySet Counts in Django
**Learning:** Performing multiple consecutive `.count()` operations on the same base Django QuerySet with different filters causes multiple N+1 table scans on the database, which creates a significant backend performance bottleneck as dataset size grows.
**Action:** Always consolidate sequential `.count()` calls on the same QuerySet into a single `.aggregate()` call using conditional `Count` and `Q` objects to retrieve all metrics in a single database pass.
