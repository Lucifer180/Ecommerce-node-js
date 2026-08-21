# Challenge P2 — Why Won't It Use My Index?

**Level:** 2  ·  **Area:** Index design, composite column order, sargability

---

## Setup

These are the three hottest queries in the app:

```sql
-- Q1: a user's recent orders
SELECT * FROM orders WHERE user_id = 42 ORDER BY created_at DESC LIMIT 20;

-- Q2: paid orders in a date range
SELECT * FROM orders WHERE status = 'paid'
  AND created_at >= '2026-06-01' AND created_at < '2026-07-01';

-- Q3: find a user by email, case-insensitive
SELECT * FROM users WHERE lower(email) = lower('User500@example.com');
```

You add `CREATE INDEX ON orders(created_at);` and `CREATE INDEX ON orders(status);`
and Q3 still does a `Seq Scan`. Someone says "just add more indexes." Do better.

---

## Your tasks

1. **Q1.** Design the single composite index that serves *both* the `WHERE` and the
   `ORDER BY ... LIMIT` without a sort step. What column order, and why does order
   matter? Prove no `Sort` node appears in the plan.
2. **Q2.** Would `(status, created_at)` or `(created_at, status)` be better? Decide
   using selectivity, and explain the rule for ordering equality vs. range columns
   in a composite index.
3. **Q3.** Explain *why* an index on `email` is ignored by `WHERE lower(email) = ...`.
   Give two different fixes and state the trade-off of each.
4. **Over-indexing.** Name three real costs of adding indexes you don't need.
   When is a `Seq Scan` actually the correct plan?

## Acceptance criteria

- [ ] Q1 plan: index scan, no sort, reads ~20 rows not thousands.
- [ ] You can articulate the "equality columns first, range/sort column last" rule.
- [ ] Q3 fixed with either a functional index or a citext/normalization approach,
      trade-off stated.
- [ ] You can explain write amplification and planner cost of excess indexes.

## Stretch

- Q2 only ever returns a few columns (`id, total_cents, created_at`). Design a
  **covering index** so the query is satisfied index-only (`Index Only Scan`).
  What has to be true about the table's visibility map for that to actually kick in?
