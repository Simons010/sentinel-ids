## 2026-04-09 - [Django Database Aggregation Optimization]
**Learning:** When using Django's `.values().annotate()` for aggregation grouping, append an empty `.order_by()` to prevent default model ordering (like `Meta.ordering`) from being added to the `GROUP BY` clause. Without it, the aggregation may break or group incorrectly.
**Action:** Always append `.order_by()` when writing `.values().annotate()` aggregations in this codebase to ensure correct and performant grouping.
