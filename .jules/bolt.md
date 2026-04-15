## 2024-05-24 - Database Aggregation over Python Loop

**Learning:** Using multiple `.count()` queries and Python-side filtering (e.g. iterating over a `.values_list()`) creates memory bottlenecks and N+1 query problems. In Django, this should be combined into a single database `.aggregate()` call using `Q` filters to handle heavy computations efficiently.

**Action:** Whenever possible, favor aggregating metric counts using `.aggregate()` with `Count` and `Q` over multiple separate `.count()` or looping over fetched subsets in Python.
