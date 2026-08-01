## 2025-01-29 - Avoid OOM in Time-Based Aggregations
**Learning:** Fetching high-volume datasets (like `NetworkLog`) into Python memory using `.values()` and loops for time-based aggregations causes critical Out-Of-Memory (OOM) regressions. Due to local MySQL timezone errors with functions like `TruncHour`, the safe and performant approach is to force the database engine to execute counting natively.
**Action:** Build a dictionary of dynamic `Count('id', filter=Q(...))` objects and unpack it into a single `.aggregate(**aggregations)` call to resolve N+1 queries without risking OOM errors.
