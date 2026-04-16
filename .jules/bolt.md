## 2024-06-25 - [Optimize Dashboard Confusion Matrix Stats]
**Learning:** Found multiple `.count()` queries being executed consecutively in `AnalyticsView.get` to calculate true positives, true negatives, false positives, and false negatives for the confusion matrix stats. This pattern causes the N+1 problem on the database as each count performs a separate query.
**Action:** Replaced the multiple `.count()` queries with a single `.aggregate()` query using `Count('id', filter=Q(...))` to compute all 4 values in a single database hit, significantly reducing database query overhead.
