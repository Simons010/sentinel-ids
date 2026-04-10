## 2025-02-26 - Optimized Dashboard Heatmap
**Learning:** Replaced 168 Django queries generated due to `filter` calls in nested `for` loops inside the Network Stats dashboard with a single `.values('date', 'hour').annotate(count=Count('id')).order_by()` aggregation using `TruncDate` and `ExtractHour`.
**Action:** When aggregating time series data across dimensions in Django, use `TruncDate` / `ExtractHour` with `values()` and `.annotate()` rather than executing `filter().count()` per time slice. Add `.order_by()` to prevent default model ordering issues.
