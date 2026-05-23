## 2024-05-24 - Optimize frequency distributions with values.annotate

**Learning:** When calculating frequency distributions (like counting occurrences of different enum values or categories), using iterative `.filter().count()` inside list comprehensions or dict loops creates an N+1 query problem. This can significantly degrade performance, especially on endpoints designed to return summary statistics.
**Action:** Replace iterative `.filter(field=val).count()` calls with a single `.values(field).annotate(count=Count(field)).order_by()` query. To ensure the API response format remains consistent and predictable, always pre-initialize the dictionary with all expected keys set to zero before populating it from the query results.
