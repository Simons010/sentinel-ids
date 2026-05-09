## 2024-05-09 - Django bulk_create ID retrieval in MySQL
**Learning:** In Django 4.2+ on MySQL, `bulk_create` correctly returns inserted instances with their primary keys (IDs) set. This is a significant performance win for ingestion endpoints (like `NetworkLogSerializer`), as it allows avoiding N+1 `.create()` inserts without breaking downstream logic that depends on those generated IDs (like batch correlation triggers).
**Action:** When optimizing N+1 query patterns in Django 4.2+ for MySQL, use `bulk_create` even if subsequent operations require the primary keys of the created objects.
