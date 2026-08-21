# 30-Day Backend Interview Prep — **rebased 2026-10-02 → 2026-11-01**

> Originally Sept 27. Five days were lost to no execution, not to a bad plan.
> Re-diagnosed 2026-10-02; the structure below stands, the emphasis changed.
> Single source of truth for this track. Mistake log: [MISTAKES.md](MISTAKES.md)

**Goal:** interview-ready for 8–10 LPA backend/full-stack roles.
**Budget:** 2 hrs/day floor + 30 min slack (set 2026-10-02). Bad-day minimum 25 min. **This track owns:** DB · Express/auth/security · System design · DevOps · Node internals.

## Re-diagnostic (2026-10-02)

| Area | Level |
|---|---|
| JavaScript / TypeScript | **Competent** — event loop solid; missed that `async` bodies run sync until first `await` |
| Backend | **Developing** — knows the layers exist; could not explain body parsing or the error→status path |
| Database | **Beginner** — self-declared weak on SQL, indexes, composite index ordering |
| Infrastructure | **Developing** (untested verbally; repo has Docker + CI/CD + Oracle deploy) |
| System Design | **Beginner** — no caching/stampede vocabulary; estimation untested |

### Headline finding

Four for four — refresh tokens, error middleware, oversell race, cache-aside — the **correct
answer was already implemented in this repo** and could not be explained. This is a
**narration gap**, not a knowledge gap. Highest-leverage fix of the month, and the most
dangerous to leave: a repo that promises more than the answers deliver reads as dishonesty
rather than inexperience.

### Gaps ranked by interview leverage

1. **SQL + indexes** — beginner, guaranteed to appear, currently unanswerable
2. **Explaining own code** — the narration gap
3. **Concurrency / transactions** — races, lost updates, isolation
4. **Caching & failure reasoning** — invalidation, stampede, degrade-vs-fail
5. **Auth model vs implementation** — believed the refresh token was in an httpOnly cookie; it is in the JSON body

### Adjustments to the plan

- **SQL every single day, 30 min, non-negotiable.** It was back-loaded to Days 10–12; that is too late for a beginner level.
- **Daily narration drill (30 min):** explain one file or concept from this repo out loud, no notes. Directly targets the headline finding.
- `challenges/postgres/P1`–`P4` already exist and were never started. P2 (index design) **is** the question that was failed today. Start there.
- Auth week now includes two build tasks: move the refresh token to an httpOnly cookie, and add a Redis denylist for instant revocation.
- Caching week includes fixing three real bugs found today in `product.service.js`.

## Original diagnostic (2026-09-27, out of 5)
JS **4** ▲ · DSA **1** ▼▼ · Mongo **2** · SQL **2** · Express/auth **2** · System design **2** · DevOps **1** ▼▼

## Time allocation (set 2026-10-02 — this replaces the 3-track split)

Three parallel tracks produced zero executed days in five days. Collapsed to **one track, one
daily slot, one decision**. This section is the schedule; there is nothing else to choose.

### The floor — 2h/day, every day, non-negotiable

| Block | Time | What | Why this slot exists |
|---|---|---|---|
| **A — DSA** | 30 min | 1 problem, timed 25 min + 5 min review. Assigned by the DSA track. | Level 1 is a screening-round blocker. Can't be skipped, can't be crammed. |
| **B — SQL / DB** | 30 min | Written queries + `EXPLAIN`. Never read-only. | Beginner level on the single most certain interview topic. |
| **C — Backend** | 45 min | The day's topic, applied hands-on in this repo. | The actual switch target. |
| **D — Narrate + review** | 15 min | Explain one file/concept **out loud, no notes**, then re-answer one old MISTAKES.md entry. | Directly targets the narration gap, which is the headline finding. |

The remaining ~30 min of the stated 2.5h is deliberate slack for overrun. Don't schedule it.

### Bad-day minimum — 25 min

Travel, illness, late night, no motivation. Do **B (SQL) + D (narrate)** only, 25 minutes, and
mark the day done. The streak matters more than the volume; a broken chain is what ended the
Sept 27 attempt. Never skip entirely.

### Sunday — mock instead of blocks

90 min timed mock, scored, no help unless fully stuck. Weak spots from the score steer the
following week.

### Frontend track: PAUSED until Week 4

Not because it doesn't matter — because it is already the **strongest** area (Competent), it is
not the gap, and the target role is backend. It returns in Week 4 as interview revision only
(React rendering, hooks, performance talking points). Two of three tracks had to die for one
to get executed.

## Knowledge vs interview-ready — not a trade-off here

Both were asked for, and in this plan they're the same activity: depth comes from explaining
real systems under questioning, and that is precisely what interviews test. Nothing gets
memorised from a template.

What *is* traded off is **breadth**. Explicitly cut for these 30 days, and the reason:

| Cut | Why |
|---|---|
| Kubernetes | Not asked at this level. Docker + a reverse proxy is the expected depth. |
| Microservices | A monolith you can explain beats microservices you can't. Interviewers at this band ask *when* to split, not how to run a mesh. |
| GraphQL, gRPC | REST is what gets tested. Mention-level awareness is enough. |
| Kafka, advanced distributed systems | BullMQ + Redis covers the queue reasoning that gets asked. Consensus, CRDTs, vector clocks: senior-level, skipped. |
| Multi-region, sharding depth | Introduced conceptually in Week 4 only. Won't be drilled. |

These come *after* the switch, not before it. Adding them now would recreate exactly the
situation found today: more systems in the repo than can be explained.

## How we work each day

1. I post the day's tasks. You do them (any tools you like).
2. You report back: `done` (moving on), or paste your work / answer and I'll **interview you on it** — I probe, challenge, find holes. That's where the real learning is.
3. End of each week = a timed mock. I grade you and adjust the next week to your weak spots.
4. Ask `solution` anytime, but try first — struggle is the point.

---

## Week 1 — Databases + Express internals (re-cut 2026-10-02)

Originally "JavaScript & Node core." Re-cut because JS tested **Competent** and DB tested
**Beginner** — spending Week 1 on a strength while the beginner gap sits untouched is backwards.
JS now appears only where it's load-bearing for backend work.

| Day | Block C — Backend (45 min) | Block B — SQL (30 min) | DSA (Block A) |
|-----|------|------|------|
| 1 (Oct 2) | Postgres setup + start `postgres/P2` (index design) | same — P2 is the SQL block today | Hashing — Two Sum, Contains Duplicate |
| 2 | Finish P2. Composite column order, covering indexes, sargability | `EXPLAIN (ANALYZE, BUFFERS)` until the plan output reads naturally | Two pointers — Valid Palindrome |
| 3 | **Request lifecycle for real:** streams, `express.json`, middleware order, `next(err)`, handler arity *(fixes M2, M3)* | JOINs — inner/left/right, on vs where | Sliding window — Longest substring |
| 4 | `postgres/P1` — the dashboard that times out. Query rewrite, joins vs correlated subqueries | GROUP BY, HAVING, aggregates | Arrays — Product Except Self |
| 5 | Node internals from the **backend** angle: blocking the event loop under load, streams, backpressure *(fixes M7)* | Subqueries → CTEs | Strings — Valid Anagram |
| 6 | Mongo: schema design, embed vs ref, indexes — compare against what you learned in Postgres | `postgres/P4` — window functions | Stack — Valid Parentheses |
| 7 | **Mock 1** (90 min, scored): DB + Express internals. Then narrate `order.service.js` start to finish, no notes | — | Timed: 2 mixed problems |

## Week 2 — Databases + Auth/Security + DSA (lists/recursion)

| Day | Backend | DSA |
|-----|---------|-----|
| 8 | MongoDB: schema design, embed vs ref, indexes | Linked list — Reverse, Cycle detect |
| 9 | MongoDB: aggregation pipeline, transactions | Linked list — Merge two, Middle, Remove Nth |
| 10 | SQL fundamentals: joins, GROUP BY, HAVING | Recursion — Subsets, Fibonacci (memo) |
| 11 | Postgres: indexes + EXPLAIN (do P1, P2) | Backtracking — Permutations |
| 12 | Transactions, locks, isolation, deadlocks (do P3) | Binary search — classic + rotated array |
| 13 | Auth: JWT, bcrypt, refresh tokens; RBAC authorization | Sorting — merge/quick (concepts + partition) |
| 14 | Security: OWASP top 10, rate limit, validation, injection, CORS | **Mock 2** (DB + security grilling) |

## Week 3 — System design + caching/queues + DevOps + DSA (trees/graphs)

| Day | Backend | DSA |
|-----|---------|-----|
| 15 | Redis: cache-aside, invalidation, TTL, patterns | Trees — BFS/DFS traversals |
| 16 | Queues: BullMQ, retries, idempotency, dead-letter | Trees — Height, LCA, Validate BST |
| 17 | System design foundations: scaling, LB, stateless, CAP | Graphs — BFS/DFS, number of islands |
| 18 | System design: rate limiter / URL shortener | Heap — Top-K elements |
| 19 | System design: ecommerce checkout + inventory (your domain) | Intervals — Merge intervals |
| 20 | Docker: images, multi-stage builds, compose | DP intro — Climbing stairs, Coin change |
| 21 | Nginx (reverse proxy, 502 debug), PM2, CI/CD, HTTPS | **Mock 3** (system design) |

## Week 4 — Integration, mocks, portfolio, revision

| Day | Focus |
|-----|-------|
| 22 | Production debugging drills: memory leaks, N+1, slow queries, 502s |
| 23 | **Full mock interview #1** (coding + backend depth) |
| 24 | **System design mock** (end-to-end) |
| 25 | Polish this repo as portfolio: README, architecture diagram, resume bullets |
| 26 | Behavioral: STAR stories, "tell me about yourself", project deep-dive |
| 27 | **Full mock interview #2** (harder, timed) |
| 28 | Targeted weak-spot drilling (from tracked gaps) |
| 29 | Rapid revision: JS + DB + system design cheat-sheets |
| 30 | **Final onsite simulation** + honest readiness verdict |

---

## Progress log

_Mentor-maintained. Strengths ▲ / gaps ▼ tracked here to steer Week 2–4._

- **Day 1 (Sep 27):** Diagnostic done. Strengths: JS (4). Emergencies: DSA (1, → DSA track) and
  DevOps (1, → boosted in this track). Mid: Mongo/SQL/Express/SysDesign (all 2).
  Adjustment: JS theory trimmed (owned by frontend track + is a strength); DevOps gets extra
  Week 3 weight; DB started earlier. Backend Day 1 focus = Node event loop from the
  backend/performance angle (blocking the loop, why it matters under load).

- **Restart (Oct 2):** Re-diagnosed after five days of no execution. Plan kept, emphasis moved:
  SQL becomes daily rather than Week-2, and a daily explain-aloud drill is added. Confirmed the
  codebase is genuinely well built (correct atomic `$inc` guard, sane error middleware, cache-aside,
  CI/CD) but cannot yet be explained — so the month is about narration + databases, not new systems.
  Mistake log started: [MISTAKES.md](MISTAKES.md) (M1–M7 from today's diagnostic).
