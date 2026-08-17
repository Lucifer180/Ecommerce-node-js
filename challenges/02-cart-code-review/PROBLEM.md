# Challenge 02 — Cart Controller Code Review

**Level:** 1  ·  **Area:** Code review, correctness, production hygiene
**Target file:** `src/controllers/cart.controller.js`

---

## Task

You are the reviewer on this PR. The author says *"cart works on my machine, adding
to cart is fine."* Review it like a senior engineer. There are **at least 4 real
defects** in this file — some are outright crashes, some are silent correctness
bugs, some are production concerns.

For **each** issue you find, write a review comment in this format:

```
[severity: blocker | major | minor]  file:line
What is wrong:
Why it matters in production:
How to fix:
```

## Hints on where to look (not the answers)

- One endpoint will throw `ReferenceError` on the very first request. Which, and why?
- `addToCart` has a branch where the change is **never persisted**. Trace all paths.
- Two endpoints assume a document exists that might be `null`.
- Every write here is a read-modify-write on the cart doc. What happens when the
  same user fires two requests at once (double-click, retry, two tabs)?
- Is `quantity` validated anywhere? What does `addToCart` do with `quantity: -3`
  or `quantity: "abc"`?

## Acceptance criteria

- [ ] All crash bugs identified with exact line + root cause.
- [ ] The silent persistence bug in `addToCart` found and explained.
- [ ] You propose a concurrency-safe way to mutate the cart (atomic update vs.
      load-mutate-save) and can justify the trade-off.
- [ ] You name the missing input validation and where it should live (hint:
      the project already uses `express-validator`).

## Stretch

- Rewrite `addToCart` as a **single atomic upsert** that handles both
  "new item" and "increment existing item" without loading the doc first.
  (Look into `$inc` with array filters, or the two-query fallback pattern.)
