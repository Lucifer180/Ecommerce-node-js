# Backend Training Challenges

Interview + production readiness drills built from **this** codebase
(Express 5 · Mongoose/MongoDB · Redis · BullMQ · Razorpay · Node cluster), plus Postgres for SQL.

**Restarted fresh 2026-10-02.** Plan: [PLAN-30-DAY.md](PLAN-30-DAY.md) · Mistake log: [MISTAKES.md](MISTAKES.md)

## How to use this

1. Open a challenge folder in order. Read `PROBLEM.md`.
2. Solve it however you like (fix real files, or in a sandbox — each problem says which).
3. Meet the **Acceptance Criteria** before moving on.
4. When done, tell the mentor `next`. To get the worked solution, ask `solution <N>`.
5. Difficulty ramps. Don't skip levels — the later ones assume the earlier muscle.

## Rules of engagement

- No answer is revealed until you ask for it.
- For every bug challenge you must be able to state: **root cause · reproduction · fix · prevention.**
- "It works now" is not done. "I can explain *why* it broke and *why* my fix holds under load" is done.

## Progress tracker

### Week 1 — Databases + explain-your-own-code

| # | Challenge | Level | Area | Status |
|---|-----------|-------|------|--------|
| W1-01 | SQL from zero: seed schema + 30 queries | 1 | SQL | ⬜ |
| W1-02 | Index the slow `orders` query, prove it with EXPLAIN | 2 | Indexes | ⬜ |
| W1-03 | Composite index column order — teach it back | 2 | Indexes | ⬜ |
| W1-04 | Narrate `order.service.js` aloud, no notes | 2 | Narration | ⬜ |

### Week 2 — Backend internals + auth

| # | Challenge | Level | Area | Status |
|---|-----------|-------|------|--------|
| W2-01 | Break and fix the request pipeline (body parsing, middleware order) | 2 | Express internals | ⬜ |
| W2-02 | Move refresh token to httpOnly cookie + SameSite + CSRF | 3 | Auth | ⬜ |
| W2-03 | Redis denylist for instant access-token revocation | 3 | Auth | ⬜ |
| W2-04 | Razorpay webhook: signature verification + idempotency | 3 | Security / payments | ⬜ |

### Week 3 — Concurrency, transactions, caching correctness

| # | Challenge | Level | Area | Status |
|---|-----------|-------|------|--------|
| W3-01 | Reproduce the oversell race, then defend the fix | 3 | Concurrency | ⬜ |
| W3-02 | Transactions, isolation levels, deadlocks | 3 | Mongo/Postgres | ⬜ |
| W3-03 | Cache bugs: key ordering, invalidation, Redis-down degrade, TTL jitter | 3 | Caching | ⬜ |
| W3-04 | Idempotent retries end to end | 4 | Reliability | ⬜ |

### Week 4 — System design + mocks

| # | Challenge | Level | Area | Status |
|---|-----------|-------|------|--------|
| W4-01 | Capacity estimation drills | 2 | Estimation | ⬜ |
| W4-02 | Design: URL shortener, then rate limiter | 3 | System design | ⬜ |
| W4-03 | Design: notification system with queue + worker | 3 | System design | ⬜ |
| W4-04 | Scored mock interviews ×3 | 4 | Mock | ⬜ |

Mark `✅` as you clear each.

## Strengths / gaps log (mentor-maintained)

**Diagnostic 2026-10-02** — full detail in [PLAN-30-DAY.md](PLAN-30-DAY.md).

- **Strengths:** event loop / microtask model (one gap), honest about not knowing, codebase is
  genuinely well built — correct atomic updates, sane error middleware, cache-aside, CI/CD.
- **Gaps:** SQL + indexes (beginner), JWT revocation model, request-pipeline internals,
  caching vocabulary, concurrency reasoning.
- **Headline:** can't yet explain code they already wrote correctly. Narration gap, not a
  knowledge gap — highest-leverage fix of the month.
