# Challenge 04 — The Transaction That Never Was

**Level:** 2  ·  **Area:** MongoDB transactions, Mongoose sessions, atomicity
**Target files:** `src/controllers/orderController.js`, `src/services/order.service.js`

---

## Incident

> **Data integrity bug.** After a failed order, we found products with
> **decremented stock but no order record**, and carts that were emptied for
> orders that don't exist. The team *thought* this was wrapped in a transaction.
> It wasn't behaving like one.

The controller opens a session and a transaction:

```js
const session = await mongoose.startSession();
session.startTransaction();
try {
  const order = await orderService.createOrder(req._id, session);
  await session.commitTransaction();
  // ...
} catch (e) {
  await session.abortTransaction();
  throw e;
} finally {
  session.endSession();
}
```

But inside the service, several operations **ignore the session**, and one line
crashes before the transaction can do its job.

```js
const order = await Order.create({ user: userId, items: orderItems, totalPrice },
                                  { session });
// ...
product.stock -= item.quantity;
await product.save();          // <-- session?
cart.items = [];
await cart.save({ session });
return order[0];
```

---

## Your tasks

Find and fix **all** of the following (there are 5):

1. **A wrong argument** is passed to the service — the order is created for the
   wrong (or undefined) user. Trace `req._id`. Is that the right property?
2. **`Order.create(doc, { session })`** — does this actually run inside the
   transaction? What is the correct call signature to pass a session to
   `Model.create`, and what does the return value become?
3. **`return order[0]`** — given the above, is `order` an array here? What does
   the caller actually receive today?
4. **`await product.save()`** runs outside the session — so the stock write is
   **not** part of the transaction and won't roll back. Fix it. (Bonus: this same
   line is also the oversell bug from Challenge 01 — solve both at once with an
   atomic, session-aware update.)
5. **`throw new ApiError(...)`** in the service references a symbol that was never
   imported. What happens at runtime when the cart is empty, and how does that
   interact with the transaction/abort logic?

Also answer: **What infrastructure requirement must MongoDB satisfy for these
transactions to work at all?** (Hint: it's why this might "work in prod but throw
on a plain local `mongod`.")

---

## Acceptance criteria

- [ ] Order, stock decrement, and cart clear either **all commit or all roll back**.
- [ ] Every write inside `createOrder` participates in the session.
- [ ] The service returns the actual created order document (not `undefined`).
- [ ] The correct user id flows from `req` into the service.
- [ ] Empty-cart path throws a real, handled error (correct status), and aborts cleanly.
- [ ] You can explain the replica-set requirement in one sentence.
