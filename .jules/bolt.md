## 2024-05-24 - [Avoid Redundant Count Queries]
**Learning:** In Django querysets, calling `.count()` multiple times on the same un-evaluated QuerySet (e.g., `logs_24h.count()`) triggers a new `SELECT COUNT(*)` query to the database each time.
**Action:** Always cache the result of `.count()` into a local variable if it needs to be reused within the same function or view to save redundant database queries.
