## 2024-05-24 - Bulk Create for NetworkLog Ingestion
**Learning:** In Django 4.2+ with MySQL, `bulk_create` correctly returns instances with primary keys (IDs). This allows replacing iterative `NetworkLog.objects.create()` calls with `NetworkLog.objects.bulk_create(instances)` during log ingestion, significantly reducing N+1 database queries without breaking downstream logic that requires these IDs.
**Action:** Use `bulk_create` instead of looping over `.create()` for log ingestion endpoints to batch database inserts and improve performance.
