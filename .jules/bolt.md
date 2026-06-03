## 2024-05-24 - Optimizing Frequency Distributions
**Learning:** When calculating counts per category (like severity breakdowns) in Django, iterative `.filter().count()` calls trigger N+1 queries. Replacing them with a single `.values('field').annotate(count=Count('field'))` query is significantly more efficient.
**Action:** Pre-initialize result dictionaries with expected keys set to zero, then update them with the query results to ensure consistent API responses while eliminating the N+1 pattern.
