# Challenge 03 — The Razorpay Webhook Is Wide Open

**Level:** 3  ·  **Area:** Security, payment integrity, idempotency
**Target file:** `src/controllers/payment.controller.js`

---

## Incident

> **Security review flagged a P0.** Anyone on the internet can mark any order as
> paid. Proof-of-concept: an attacker sent a hand-crafted JSON body to
> `POST /api/payments/webhook` and our system trusted it.

Current handler:

```js
exports.webhookHandler = asyncHandler(async (req, res) => {
  const event = req.body;
  console.log(event);
  res.status(200).json({ success: true, message: "Webhook received successfully" });
});
```

It logs whatever it's given and returns `200`. There is **no verification that the
request actually came from Razorpay.**

---

## Your tasks

1. **The vulnerability.** Explain precisely how an attacker abuses this. Why is
   "the body says `payment.captured`" not proof of payment?
2. **Signature verification.** Implement Razorpay webhook signature verification.
   - Which header carries the signature?
   - What is the exact HMAC algorithm and what is the secret?
   - **Critical gotcha:** you must verify the signature against the *raw request
     body bytes*, not the parsed JSON object. Our `app.js` does
     `app.use(express.json())` globally — explain why that breaks signature
     verification and how you fix it for this one route.
3. **Idempotency.** Razorpay retries webhooks (at-least-once delivery). If the same
   `payment.captured` event arrives 3 times, the order must be marked paid **once**
   and stock/emails must not fire 3 times. Design the idempotency mechanism.
   Where is the dedup key stored, and what makes it safe under concurrent retries?
4. **Correct response semantics.** When should this endpoint return `200` vs a
   `4xx`/`5xx`? What does Razorpay do differently for each, and why does returning
   `200` on a *failed* internal write cause silent data loss?

---

## Acceptance criteria

- [ ] Requests with a missing/invalid signature are rejected (correct status),
      before any business logic runs.
- [ ] Verification uses the raw body — you've solved the `express.json()` problem.
- [ ] Replayed/duplicate events are processed exactly once.
- [ ] The order state transition (`pending` → `paid`) happens only inside the
      verified, deduplicated path.
- [ ] Secrets come from env, never hardcoded.

## Stretch

- Where should stock actually be decremented — at "create order" or at
  "payment captured webhook"? Argue the correct design and what it means for
  the oversell fix in Challenge 01.
