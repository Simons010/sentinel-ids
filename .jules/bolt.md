## 2024-07-04 - Optimize Multiple Counts with Aggregate
**Learning:** Django ORM issues separate queries for each `.count()` call on a queryset, which leads to N+1-like performance issues (4 table scans instead of 1).
**Action:** When calculating multiple subsets of a single QuerySet (like TP, TN, FP, FN metrics), use a single `.aggregate()` with conditional `Count('id', filter=Q(...))` statements. This reduces the number of database queries and significantly speeds up endpoints processing large datasets.
