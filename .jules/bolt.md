## 2024-05-24 - Django Sequential Count Anti-Pattern
**Learning:** Discovered a codebase-specific performance pattern where multiple sequential `.count()` queries were being executed on the same `NetworkLog` and `Alert` querysets across multiple views (e.g., calculating confusion matrices and stats cards). This resulted in redundant table scans and N+1 query problems.
**Action:** Consolidate multiple sequential `.count()` queries on the same queryset into a single `.aggregate()` call using conditional `Count` and `Q` objects to perform the aggregation in a single database roundtrip.
