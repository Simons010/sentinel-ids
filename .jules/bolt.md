## 2024-03-24 - Avoid values_list on large querysets
**Learning:** Pulling massive querysets into Python memory using `values_list(..., flat=True)` for iterative calculations causes severe memory bloat and risks Out-Of-Memory (OOM) errors. Additionally, executing multiple sequential `.count()` queries results in unnecessary database roundtrips.
**Action:** Always prefer combining calculations and counts into a single database-level query using `.aggregate()` with `Count` and `Q` filters to reduce memory footprint and database overhead.
