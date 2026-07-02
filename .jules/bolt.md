## 2026-07-02 - Optimize sequential count queries with aggregate
**Learning:** Performing multiple sequential `.count()` queries on the same Django queryset for calculating confusion matrix metrics (TP, TN, FP, FN) results in multiple database roundtrips and high latency, which is a performance bottleneck.
**Action:** Consolidate multiple sequential `.count()` queries on the same queryset into a single `.aggregate()` call using conditional `Count` and `Q` objects to reduce database queries to just one, significantly improving query performance.
