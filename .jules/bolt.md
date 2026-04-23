## 2024-05-24 - [Django Performance]
**Learning:** Consolidating multiple `.count()` queries and Python-side iterations over `.values_list()` into a single database `aggregate` query with `Q` objects is highly effective. However, unit testing in this restricted sandbox requires mocking standard libraries or manually verifying logic since network isolation prevents `pip install django`.
**Action:** Always attempt to test locally with unit tests; when dependencies are missing, perform rigorous syntax and manual trace checks to ensure correctness.
