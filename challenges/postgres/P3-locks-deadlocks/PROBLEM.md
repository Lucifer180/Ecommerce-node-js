# Challenge P3 — Locks, Lost Updates & a Deadlock

**Level:** 3  ·  **Area:** Transactions, isolation levels, row locks, deadlocks

Open **two** psql sessions side by side (call them **A** and **B**) for this one.

---

## Part 1 — The lost update

Two requests decrement the same product's stock at once. Naive code does:

```sql
-- Session A                          -- Session B
BEGIN;                                BEGIN;
SELECT stock FROM products            SELECT stock FROM products
  WHERE id = 1;   -- reads 10           WHERE id = 1;   -- reads 10
UPDATE products SET stock = 9          UPDATE products SET stock = 9
  WHERE id = 1;                          WHERE id = 1;   -- blocks, then...
COMMIT;                               COMMIT;
```

**Tasks:**
1. Run it. Final stock is `9`, but two units were sold. Explain the lost update
   and the exact moment it happened.
2. Fix it **three** different ways and compare them:
   - `SELECT ... FOR UPDATE` (pessimistic)
   - a single atomic `UPDATE ... SET stock = stock - 1 WHERE id = 1 AND stock >= 1`
   - `REPEATABLE READ` / `SERIALIZABLE` with retry on serialization failure
3. For the atomic `UPDATE`, how do you detect "not enough stock" from the result?

## Part 2 — Manufacture a deadlock

Design a two-session sequence that produces:
`ERROR: deadlock detected`.

**Tasks:**
4. Write the exact interleaving of statements in A and B that deadlocks. (Hint:
   two rows, locked in opposite order.)
5. Which session does Postgres kill, and how does it decide?
6. **Prevention.** State the single most important rule for avoiding deadlocks in
   application code, and how you'd make the killed transaction recover gracefully.

## Acceptance criteria

- [ ] You reproduced a real lost update and a real `deadlock detected`.
- [ ] You can rank the three concurrency fixes by throughput and correctness.
- [ ] You can explain the difference between a row lock wait and a deadlock.
- [ ] You know the consistent-lock-ordering rule cold.

## Interviewer follow-ups

- What's the default isolation level in Postgres, and what anomalies does it still allow?
- Does `SELECT ... FOR UPDATE` block plain `SELECT`s? Why or why not (MVCC)?
- Where does `SKIP LOCKED` fit, and what's it perfect for (hint: job queues)?
