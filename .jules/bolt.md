## 2024-05-24 - Combine multiple .count() queries into single .aggregate()
**Learning:** In Django API views performing analytics on the same queryset, using multiple sequential `.count()` queries incurs a separate database network roundtrip for each.
**Action:** Always combine multiple `.count()` operations on the same dataset into a single `.aggregate()` query using `Count('id', filter=Q(...))` to minimize database overhead.
