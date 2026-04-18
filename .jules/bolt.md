## 2024-05-24 - [Initial entry]
## 2024-05-24 - [Optimize Time-Series Aggregations]
**Learning:** For Django query optimization within this project, N+1 query loops used for time-series data (like hourly threat breakdowns) or multiple `.count()` queries should be avoided.
**Action:** Replace multiple `.count()` queries with single `.aggregate()` calls using `Q()` objects, and replace time-series loops with `.values().annotate()` using `TruncHour` to pull data in one single database query.
