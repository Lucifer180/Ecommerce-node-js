# Challenge 01 — Oversell Under Concurrency

**Level:** 2  ·  **Area:** Concurrency, MongoDB atomic operations
**Target file:** `src/services/order.service.js`

---

## Incident

> **SEV-1 — Oversold flash item.** A product had `stock: 5`. During a 2-second
> traffic spike, **9 orders** were created for it and stock went to `-4`.
> Warehouse can't ship what doesn't exist. Finance is furious. Support is
> issuing refunds by hand.

The relevant code (simplified from `createOrder`):

```js
for (const item of cart.items) {
  const product = await Product.findById(item.product._id);

  if (product.stock < item.quantity) {
    throw new Error("insufficient stock ");
  }

  product.stock -= item.quantity;
  await product.save();
  // ...
}
```

Under sequential testing this is fine. Under load it oversells.

---

## Your tasks

1. **Root cause.** Name the exact bug class and describe the precise interleaving
   of two concurrent requests that lets stock go negative. Draw the timeline
   (T1 reads, T2 reads, T1 writes, T2 writes...).
2. **Reproduction.** Design a test that reliably reproduces the oversell. It is
   "intermittent under load" — how do you make it deterministic enough to fail
   in CI? (You have `jest` + `mongodb-memory-server` available.)
3. **The fix.** Rewrite the stock decrement so it is **atomic** and cannot
   oversell, even with 500 concurrent requests hitting the same product.
   - Do it with a single MongoDB operation. Which operator + which query
     condition guarantees safety?
   - What does the operation return when stock is insufficient, and how do you
     detect that to reject the order?
4. **Prevention.** What schema-level and process-level guardrails stop this whole
   class of bug from recurring? (Think: constraints, invariants, tests, code review checklist.)

---

## Acceptance criteria

- [ ] Stock can never go below 0, proven under concurrent load.
- [ ] Insufficient-stock requests are rejected cleanly (correct error + status),
      not silently.
- [ ] The fix uses an atomic DB operation — no read-then-write gap.
- [ ] You can state root cause, repro, fix, and prevention in under 90 seconds
      (interviewer will ask).

## Stretch (senior-level)

- The current loop also has an **N+1 query**: the cart is `.populate("items.product")`
  yet each iteration calls `Product.findById` again. Find it and eliminate it.
- If two items in the cart reference the same product, does your atomic fix still
  hold? Prove it.
