# Challenge P4 — Window Functions

**Level:** 2  ·  **Area:** `ROW_NUMBER`, `RANK`, running totals, dedup, gaps-and-islands

Window functions are the single most common "can you actually write SQL" filter in
interviews. Write each query, then be ready to explain `PARTITION BY` vs. `GROUP BY`.

---

## Tasks

1. **Nth per group.** For each `category`, return the **top 3 products by price**.
   Include ties correctly — then do a version that breaks ties (exactly 3 rows).
   Which window function for each?

2. **Running total.** For user `id = 42`, list their orders by date with a
   **cumulative lifetime spend** column that grows down the rows.

3. **Deduplicate.** Suppose `payments` accidentally has duplicate rows per
   `order_id`. Write a query that keeps only the **latest** payment per order and
   would let you delete the rest. (Hint: `ROW_NUMBER() OVER (PARTITION BY ... ORDER BY ...)`
   then filter `rn = 1`.)

4. **Month-over-month.** Monthly revenue (sum of `total_cents` on `paid` orders),
   plus a column showing the **% change vs. the previous month** using `LAG`.

5. **Gaps-and-islands (stretch).** Find the longest streak of **consecutive days**
   on which at least one order was placed. This is the classic hard one — explain
   the `row_number` differencing trick.

## Acceptance criteria

- [ ] Correct results verified against the seeded data.
- [ ] You can state the difference between `ROW_NUMBER`, `RANK`, `DENSE_RANK`
      and when each is right.
- [ ] You can explain why a window function can see other rows while `GROUP BY`
      collapses them.
- [ ] Q3's dedup pattern is one you can write from memory in an interview.

## Interviewer follow-ups

- Can you use a window function in a `WHERE` clause? Why not, and what's the fix?
- What does the default window frame (`RANGE ... CURRENT ROW`) do, and when does
  it bite you on running totals with duplicate order dates?
