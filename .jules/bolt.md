## 2025-02-15 - Consolidating QuerySet Counts
**Learning:** In Django, performing multiple `.count()` queries on the same annotated queryset triggers redundant table scans. Consolidating them into a single `.aggregate()` call with conditional `Count` and `Q` objects avoids unnecessary database load.
**Action:** Use `.aggregate()` when counting multiple conditional slices of the same large dataset.
