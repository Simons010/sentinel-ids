## 2024-05-18 - [Optimize Batch Log Ingestion]
**Learning:** Using iterative `Model.objects.create()` during bulk log upload in DRF serializers leads to severe N+1 database queries, slowing down log ingestion drastically. In Django 4.2+ MySQL environment, `bulk_create` correctly returns instances with primary keys, so it is safe to use it without losing ID assignments.
**Action:** Replace iterative `.create()` loops with `.bulk_create(instances)` when ingesting bulk data in serializers to improve database throughput.
