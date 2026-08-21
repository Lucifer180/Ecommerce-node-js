# Challenge P1 — The Dashboard That Times Out

**Level:** 3  ·  **Area:** Query rewrite, EXPLAIN ANALYZE, indexing

---

## Incident

> The "Top Customers (last 90 days)" admin dashboard got slower every week and now
> times out at 30s. Here's the query behind it:

```sql
SELECT
  u.id,
  u.email,
  (SELECT COUNT(*)            FROM orders o WHERE o.user_id = u.id) AS order_count,
  (SELECT COALESCE(SUM(o.total_cents),0) FROM orders o WHERE o.user_id = u.id) AS lifetime_cents,
  (SELECT MAX(o.created_at)   FROM orders o WHERE o.user_id = u.id) AS last_order_at
FROM users u
WHERE u.created_at >= now() - interval '90 days'
ORDER BY lifetime_cents DESC
LIMIT 50;
```

Tables: `users` (~200k), `orders` (~1M), `order_items` (~2.5M). No secondary indexes exist.

---

## Your tasks

1. **Why is it slow?** Count how many times `orders` is scanned as written, and
   describe the access pattern. Run `EXPLAIN (ANALYZE, BUFFERS)` and identify the
   villain node.
2. **Rewrite it** to compute all three aggregates in a single pass over `orders`
   (hint: aggregate + join, or a lateral join). Prove the row output is identical.
3. **Index it.** Which index makes your rewrite fast? Justify the column order.
   Show the plan before vs. after.
4. **The hidden trap.** `ORDER BY lifetime_cents DESC LIMIT 50` still has a cost
   even after your rewrite + index. What is it, and how would a real company make
   a "top customers" dashboard scale at 100x data? (Think beyond a single query.)

## Acceptance criteria

- [ ] Rewritten query scans `orders` once, not per-user.
- [ ] `EXPLAIN ANALYZE` shows the villain node gone.
- [ ] You can name the exact index(es) and defend column order.
- [ ] You can explain the `ORDER BY ... LIMIT` cost and one scaling strategy
      (materialized view / rollup table / incremental aggregation).

## Interviewer follow-ups (be ready)

- What's the difference between a correlated subquery and a join here, mechanically?
- When would the correlated-subquery form actually be *faster*?
- Your rewrite excludes users with zero orders — did the original? Fix the discrepancy.
