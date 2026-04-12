## 2024-05-24 - [Django Aggregation Performance]
**Learning:** Using multiple `.count()` queries in a Django view causes the application to hit the database sequentially. Additionally, iterating over a queryset utilizing `.values_list()` forces the entire subset of data into Python's memory, which is inefficient.
**Action:** Consolidate multiple counting or filtering queries into a single database hit using `.aggregate()` combined with `Count("id", filter=Q(...))`. This optimizes network roundtrips and handles the calculations efficiently at the database level.
