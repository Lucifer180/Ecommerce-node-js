# Mistake Log

Reviewed daily, 15 min. Spaced repetition: re-answer anything older than 3 days without looking.

---

## M1 — Middleware order vs routing (2026-10-02) — self-corrected

- **Said:** auth middleware runs, then route matching.
- **Correct:** Express walks its stack top-down; routing decides *which* middleware chain runs.
  `authMiddleware` only runs if mounted on that route — which is how `/api/auth/login` stays public.
- **Status:** corrected unaided. Low risk.

## M2 — Who builds `req.body` (2026-10-02)

- **Said:** don't know.
- **Correct:** `req` is a readable stream. `express.json()` buffers chunks, checks
  `Content-Type`, `JSON.parse`s, assigns `req.body`.
- **Mental model:** nothing is automatic. No parser → `req.body` is `undefined` → destructuring
  throws TypeError. Parser present but no `Content-Type` → `req.body` is `{}` → silent garbage.
- **Bonus:** `verify` hook keeps `req.rawBody` for the Razorpay webhook because HMAC covers raw
  bytes; `JSON.stringify(req.body)` cannot reproduce them.
- **Practice:** what breaks if `express.json()` is mounted *after* the routes?

## M3 — Error → HTTP status path (2026-10-02)

- **Said:** "it sends product not found" (behaviour, not mechanism).
- **Correct:** service `throw`s `AppError` → async rejection → `asyncHandler`'s `.catch(next)` →
  `next(err)` makes Express skip remaining middleware → 4-arity error handler (registered last)
  → `res.status(404).json(...)`.
- **Mental model:** services are HTTP-agnostic; they throw domain errors. One error middleware is
  the only place errors become status codes. Without `asyncHandler` on Express 4, an async throw
  is an unhandled rejection: the request hangs forever.
- **Practice:** what happens if the error handler takes 3 params instead of 4?

## M4 — JWT revocation (2026-10-02) — got this wrong twice

- **Said:** a stolen access token stops working once the user logs out.
- **Correct:** it keeps working until `exp`. `protect` only does `jwt.verify` + `findById` —
  it never reads `user.refreshToken` (which is `select: false` anyway).
- **Mental model:** access-token verification is **pure math**, no DB state, so a valid signature
  cannot be un-signed. Logout is a client-side illusion for access tokens. It *does* kill the
  refresh token (compared against Mongo), so logout caps exposure to the access token's TTL.
  Short expiry = **containment, not prevention**.
- **Fix for true revocation:** Redis denylist or `tokenVersion` claim; costs a lookup per request.
- **Practice:** stateless vs stateful token verification — state the trade-off in one sentence.

## M5 — Oversell race condition (2026-10-02)

- **Said:** don't know.
- **Correct:** read-modify-write with a gap. Both requests read `stock = 2`, both pass the check,
  both write `0`. One decrement is lost. Names: **race condition / lost update / TOCTOU**.
- **Mental model:** never decide in application memory on a value the DB can change underneath you.
  Move the guard *into* the write: `findOneAndUpdate({_id, stock: {$gte: qty}}, {$inc: {stock: -qty}})`.
  Postgres: `UPDATE ... WHERE id=$2 AND stock >= $1`. A transaction alone does **not** fix this —
  it needs `SELECT FOR UPDATE` or a version column.
- **Note:** `src/modules/orders/order.service.js:47` already does this correctly.
- **Practice:** same bug in a "transfer money between accounts" endpoint.

## M6 — Caching (2026-10-02)

- **Said:** could not answer.
- **Correct:** cache-aside. Miss → DB → write with TTL. Hit → parse → respond.
  Invalidation options: TTL / explicit DEL / write-through. Version-prefix keys beat `SCAN`
  (never `KEYS` in production). Mass simultaneous expiry of a hot key = **cache stampede**;
  fix with single-flight lock, TTL jitter, or stale-while-revalidate.
- **Mental model:** a cache outage must degrade latency, never availability.
- **Note:** `src/modules/products/product.service.js:71` is cache-aside already, with 3 real bugs
  (order-sensitive key, no invalidation on write/delete, `redis.get()` throw → 500).
- **Practice:** which data must never be served from cache in this repo, and why?

## M7 — async function start timing (2026-10-02)

- **Said:** `1 7 3 4 5 6 2`.
- **Correct:** `1 5 7 3 4 6 2`.
- **Why wrong:** an `async` function body runs **synchronously** until the first `await`.
  `async` does not mean deferred.
- **Mental model:** sync pass → drain microtask queue *completely* → next macrotask.
  `.then`, `queueMicrotask`, and `await` continuations share one FIFO microtask queue.
- **Practice:** rewrite with `await` before `console.log("5")` and predict again.
