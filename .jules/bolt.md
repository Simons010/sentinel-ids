## 2024-05-17 - Optimize Django N+1 query breakdown
**Learning:** In Django, executing `.filter().count()` iteratively in a loop causes N+1 queries. When aggregating by field with `.values().annotate()`, appending `.order_by()` is necessary to clear default ordering which might interfere with grouping.
**Action:** Replace iterative counts with a single query using `.values('field').annotate(count=Count('field')).order_by()`, and iterate through the result to populate pre-initialized dictionaries to ensure all keys are present even if counts are 0.
