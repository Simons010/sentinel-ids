## 2024-08-16 - Fix N+1 queries using Conditional Aggregation
**Learning:** Local database timezone limitations (like those with TruncHour in MySQL/SQLite) can be bypassed by using native Conditional Aggregation via `Count(filter=Q(...))`. Iterating in Python causes severe N+1 regressions.
**Action:** Always prefer native database aggregations (`aggregate` / `annotate`) using `Q` filters over loops and repeated database `.count()` operations.
