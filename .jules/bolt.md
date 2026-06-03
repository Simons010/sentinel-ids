## $(date +%Y-%m-%d) - Optimize N+1 queries for frequency distributions
**Learning:** When calculating frequency distributions or breakdowns (like counts per severity), using iterative `.filter().count()` calls causes N+1 queries (one query per category).
**Action:** Replace these iterative calls with a single `.values('field').annotate(count=Count('field')).order_by()` query and pre-initialize the result dictionary with all expected keys set to zero. This ensures consistent API responses and minimizes database round-trips.
