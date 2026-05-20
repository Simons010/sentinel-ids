## 2024-05-18 - Use bulk_create for NetworkLog ingestion
**Learning:** In this Django 4.2+ MySQL environment, `bulk_create` correctly returns instances with primary keys (IDs), supporting downstream logic that requires them. Using `bulk_create` instead of iterative `.create()` calls significantly speeds up log ingestion and reduces the number of database queries.
**Action:** Always prefer `bulk_create` over iterative `.create()` for batch insertion of logs or objects in this environment, as it retains the necessary IDs and provides massive performance benefits without trade-offs.
