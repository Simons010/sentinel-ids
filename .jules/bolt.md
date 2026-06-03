
## 2024-05-12 - Optimize Severity Counts via Database Aggregation
**Learning:** Found N+1 query patterns in DRF views calculating frequency distributions (like `DashboardStatsView` and `ThreatsStatsView`) where `.filter(severity=s).count()` was used iteratively in a Python loop or comprehension. Pulling aggregated data one key at a time leads to multiple database hits.
**Action:** Replace iterative `.filter().count()` calls with a single `values('field').annotate(count=Count('field')).order_by()` database query. Always pre-initialize the result dictionary with all expected keys to zero before applying the results, guaranteeing consistent API responses even if the queryset returns no data for specific keys.
