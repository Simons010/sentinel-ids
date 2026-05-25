## 2024-05-25 - N+1 Query in Frequency Distributions
**Learning:** Iterating over a list of categories to perform `.filter(category=val).count()` triggers an N+1 query problem, which is detrimental to performance in frequency breakdowns like severity distributions.
**Action:** Replace iterative count calls with a single query using `.values('category').annotate(count=Count('category')).order_by()`, and pre-initialize the expected keys in the dictionary to ensure consistent API responses without missing categories.
