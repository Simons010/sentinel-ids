## 2024-07-09 - Django ORM N+1 in Time Segment Loops
**Learning:** In the Dashboard and Analytics views, multiple sequential `.count()` queries inside a 24-hour loop cause excessive database calls (3 queries per hour = 72 queries).
**Action:** Consolidate these multiple `.count()` queries into a single `.aggregate()` call with conditional `Count` and `Q` objects within the loop, reducing the number of queries and speeding up the view.
