## 2024-05-24 - DB-level aggregation for massive QuerySets
**Learning:** Loading massive amounts of `NetworkLog` rows into Python memory with `.values_list()` causes severe OOM risks. For huge datasets, pulling all records into memory to aggregate them is an anti-pattern and can cause server crashes.
**Action:** Use Django's database-level aggregation features (e.g., `TruncHour` combined with `Count()`) so that the grouping is performed on the database side and exactly 24 rows are returned to the application, keeping it memory-safe and efficient.
