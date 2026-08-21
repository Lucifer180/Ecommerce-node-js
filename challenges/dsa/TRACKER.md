# DSA / LeetCode Track — 1 Month Sprint

**Start:** 2026-09-27 · **Target end:** 2026-10-27
**Language:** JavaScript (user's choice, 2026-09-28 — switched from TypeScript)
**Starting level (self-reported + Q1):** < 50 problems lifetime, last consistent practice > 6 months ago, patterns known conceptually but not applied under pressure.

## Rules of engagement

- Problems are assigned one at a time with the **official LeetCode URL** only. No pattern, no data structure, no expected complexity up front.
- Before coding, answer the 6 **Before You Code** questions (inputs / output / constraints / edge cases / brute force / brute-force complexity).
- Hints are progressive (1 Observation → 2 Direction → 3 Data structure → 4 Pattern → 5 Algorithm → 6 Pseudocode → 7 Implementation in JavaScript). Hint count is recorded.
- After solving, submit: approach · JavaScript code · time complexity · space complexity · edge cases. Review comes after, code is not replaced for you first.
- Measured on **depth**: pattern recognition, deriving solutions, explaining reasoning, optimizing brute force, complexity analysis, edge cases, variations. Not problem count.

## 4-week shape (adjusted live based on performance)

| Week | Dates | Focus | Notes |
|------|-------|-------|-------|
| 1 | Sep 27 – Oct 3 | Arrays · Strings · Hash Map/Set · complexity fundamentals | Mostly Easy. Rebuild speed + rigor. |
| 2 | Oct 4 – Oct 10 | Two Pointers · Sliding Window · Prefix Sum · Stack · Binary Search | Easy→Medium. First spaced-repetition checks on Week 1. |
| 3 | Oct 11 – Oct 17 | Linked Lists · Recursion · Binary Trees · BST · BFS/DFS · Heap | Medium-heavy. |
| 4 | Oct 18 – Oct 27 | Graphs · Backtracking · intro Greedy/DP · **Interview Mode** | Mixed blind problems, no pattern given. |

> Honest scope note: one month from cold gets you solid through Stages 1–4 and an
> *introduction* to Stage 5. Dynamic programming will not be mastered in this window —
> the goal is to recognize it and solve the standard 1-D cases, not to be fluent.

## Progress tracker

| # | Date | Problem | Pattern | Diff | Solved Independently | Hints | Time | Mistakes | Confidence |
|---|------|---------|---------|------|----------------------|-------|------|----------|------------|
| 1 | Sep 28 – Oct 1 | [Contains Duplicate](https://leetcode.com/problems/contains-duplicate/) | Sorting + adjacent scan, then Hash Set | Easy | Partly | 6 | ~5 days elapsed | loop-counter mutation (x3), `j` start index, ran samples instead of Submit, `new Set(nums)` pre-filled, copied `length-1` bound without its reason, `==` vs `===` | 🟡 |

## Pattern status

### 🟢 Mastered
_(empty — nothing proven yet)_

### 🟡 Developing
- **Hash Set** — needed hints 1-6 to reach it, but wrote it correctly once the structure was named.
- **Sorting as a preprocessing step** — derived this one independently from a guiding question. Good sign.

### 🔴 Weak
- **Big-O analysis** — started from zero. Taught the basics + the "constraints tell you the required complexity" rule. Not yet self-applied; has not once volunteered a complexity unprompted.
- **Loop mechanics** — mutated `i`/`j` inside the body across three separate attempts; derives loop bounds by copying rather than from what the body reads.
- **Verification discipline** — treated sample-case "Run" as proof of correctness.

### 🔄 Review queue
- Contains Duplicate — re-solve cold in Week 3, Set version, no hints.

## Strengths / gaps log

**2026-10-01 — after problem 1 (Contains Duplicate)**

Strengths: does not look up answers; brings real attempts. Derived the sort-then-scan approach unaided from a Socratic question. Accepts correction without defensiveness and iterates.

Gaps, in priority order:
1. **JavaScript loop fluency** is the bottleneck, not algorithmic insight. Three consecutive submissions kept `i++`/`j++` inside loop bodies after being told twice to remove them.
2. **No complexity vocabulary at entry.** Taught Big-O basics and the constraint→complexity table mid-problem.
3. **Rules applied without their reason** (the `length - 1` bound carried into a loop with no lookahead).
4. Habitually writes `==`; has not switched to `===` despite three prompts.

Pace concern: 5 days elapsed on problem 1 of a 30-day sprint. Asked the user twice whether the blocker is time, JS syntax, or algorithmic thinking — no answer yet. **If JS syntax: pause DSA, drill plain JS loops/Map/Set for 3 days** using the frontend track.
