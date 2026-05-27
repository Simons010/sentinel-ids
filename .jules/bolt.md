## 2024-05-24 - N+1 Queries in Frequency Distributions

**Learning:** Calculating frequency distributions using list comprehensions with `.filter(field=val).count()` inside views (e.g., severity breakdowns) leads to N+1 queries. When replacing this with a more efficient `.values('field').annotate(count=Count('field'))` approach, it is critical to append an empty `.order_by()` to clear any default model ordering which might group results incorrectly.

**Action:** Always replace iterative `.count()` patterns with `.values().annotate()` for aggregating breakdowns. Pre-initialize the result dictionary with all expected keys set to zero to ensure API contracts remain consistent even if a specific category has zero occurrences in the database, and always append `.order_by()` to the annotation query.
