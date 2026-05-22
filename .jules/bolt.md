## 2024-05-18 - [Optimize N+1 Query Patterns in Django Aggregations]
**Learning:** When calculating frequency distributions or breakdowns in Django (like grouping counts by severity), iterating with `.filter().count()` results in multiple queries (N+1 problem) to the database.
**Action:** Replace iterative `.filter().count()` calls with a single `.values('field').annotate(count=Count('field')).order_by()` query. Pre-initialize the result dictionary with expected keys set to zero to handle missing groups and ensure consistent API responses.
