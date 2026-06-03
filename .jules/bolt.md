## 2024-05-24 - Optimize network log ingestion using bulk_create
**Learning:** In Django 4.2+ on MySQL, `bulk_create` correctly returns instances with primary keys (IDs). This allows replacing iterative `.create()` calls with `.bulk_create()` to optimize database insertions while still supporting downstream logic that requires primary keys.
**Action:** Replace iterative `.create()` loops with `.bulk_create()` when performing bulk insertions, even if primary keys are needed.
