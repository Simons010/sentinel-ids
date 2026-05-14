## 2024-05-19 - Using bulk_create in LogIngestView

**Learning:** When ingesting large lists of logs in `NetworkLogSerializer.create()`, using iterative `NetworkLog.objects.create()` generates an N+1 query pattern. We can optimize this by replacing it with a single `NetworkLog.objects.bulk_create(instances)`. In this specific environment (Django 4.2+ on MySQL), `bulk_create` correctly returns instances populated with their primary keys (IDs). This is critical because downstream logic (like `LogIngestView` generating `results` containing `log_instance.id`) relies on the IDs being available immediately after the bulk operation, and without IDs being returned, it would break.

**Action:** Whenever bulk creating models in this codebase where IDs are needed downstream, confidently use `bulk_create()` to avoid N+1 query performance bottlenecks.
