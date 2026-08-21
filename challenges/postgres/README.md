# PostgreSQL Track

Standalone SQL/Postgres drills for interview + production readiness. Your app runs
MongoDB, so these use their own seedable ecommerce schema — but SQL is heavily
tested in backend interviews and this is where you build real query intuition.

## Setup (once)

```bash
# 1. Start a throwaway Postgres (port 5433 so it won't clash with anything)
docker run --name pg-train -e POSTGRES_PASSWORD=pg -p 5433:5432 -d postgres:16

# 2. Load schema + ~1M orders (takes ~30–60s)
psql "postgresql://postgres:pg@localhost:5433/postgres" -f schema.sql

# 3. Open a shell
psql "postgresql://postgres:pg@localhost:5433/postgres"
```

The schema ships with **only primary keys** — no secondary indexes. Adding the
right ones is the exercise.

Useful psql:
- `\d orders` — describe a table
- `\timing on` — show query time
- `EXPLAIN (ANALYZE, BUFFERS) <query>;` — the tool you'll live in

## How to verify yourself

Every challenge is measurable: a query that returns wrong rows is wrong; a plan
with a `Seq Scan` where you expected an `Index Scan` isn't done. Use
`EXPLAIN ANALYZE` before and after — if you can't show the plan changed, you
haven't proven the fix.

## Problems

| # | Challenge | Level | Area |
|---|-----------|-------|------|
| P1 | The dashboard that times out | 3 | Query rewrite, joins vs. correlated subqueries, EXPLAIN |
| P2 | Why won't it use my index? | 2 | Index design, composite column order, sargability |
| P3 | Locks, lost updates & a deadlock | 3 | Transactions, isolation, `FOR UPDATE`, deadlocks |
| P4 | Window functions | 2 | `ROW_NUMBER`, running totals, dedup, gaps-and-islands |

Ask `solution P1` (etc.) for the worked answer. Reply `next` when done.
