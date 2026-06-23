## 2024-05-24 - Avoid Multiple Count Queries on Annotated Querysets
**Learning:** Performing multiple independent `.count()` queries on the same annotated queryset triggers redundant full table scans, which can be a significant performance bottleneck when calculating metrics like True Positives, True Negatives, etc.
**Action:** Consolidate multiple related `.count()` queries on the same queryset into a single `.aggregate()` call using conditional `Count` and `Q` objects to perform the aggregation in a single pass.
