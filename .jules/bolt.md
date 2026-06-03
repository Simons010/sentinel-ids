## 2024-05-24 - N+1 Queries in Frequency Distributions

**Learning:** When generating breakdown data (e.g., counts per severity level), replacing iterative `.filter().count()` queries with a single `.values().annotate(count=Count('id'))` significantly improves database performance by eliminating N+1 query patterns. In this Django environment, you MUST append an empty `.order_by()` to the query to clear default model ordering that might otherwise interfere with the intended grouping logic. Always pre-initialize the result dictionary with zeros for all expected keys so API consumers receive a consistent data structure even if a category has no records.

**Action:** Replace `for key in keys: queryset.filter(field=key).count()` with pre-initializing a dict of zeros, running a single grouped query `list(queryset.values('field').annotate(count=Count('id')).order_by())`, and updating the dictionary with the results.
