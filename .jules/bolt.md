## 2026-04-22 - Optimize NetworkStats heatmap generation
**Learning:** Using `values().annotate()` requires a trailing `.order_by()` to prevent Django's default model ordering from leaking into the `GROUP BY` clause and breaking the aggregation.
**Action:** Always append `.order_by()` to `.values().annotate()` queries when aggregating.
