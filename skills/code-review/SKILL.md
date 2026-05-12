---
name: code-review
description: Use when the user asks for code review, PR review, diff review, implementation audit, regression risk review, bug finding, missing test review, maintainability review, JavaScript and TypeScript style review, or review of agent/tool-call boundaries. This skill produces findings first with file and line references, checks SRP and SOLID boundaries, security/tool surfaces, and clear functional collection style in JS and TS without over-engineering.
---

# Code Review

Use this skill when the task is review, not implementation. The goal is to find bugs, regressions, missing tests, unclear ownership boundaries, unsafe behavior, and maintainability risks before code ships.

Read `references/review-checklist.md` for broad reviews. Read `references/js-ts-style.md` when reviewing JavaScript or TypeScript.

## Review Stance

- Findings lead. Put bugs and risks before summary.
- Ground every finding in a file and line when possible.
- Prioritize correctness, user-visible behavior, data loss, security, regression risk, and missing tests.
- Do not rewrite code during a review unless the user explicitly asks for fixes.
- If there are no findings, say so and name residual risk or test gaps.

## What To Check

1. Behavior and regression risk.
   - Does the change satisfy the requested behavior?
   - Are edge cases, loading/error states, empty data, and concurrency handled?
   - Is there a path to data loss, stale state, inconsistent cache, or broken user flow?

2. Boundaries and design.
   - Each unit should have one clear responsibility.
   - Dependencies should point in the expected direction.
   - Domain logic should not leak into UI, transport, persistence, or framework glue without reason.
   - SOLID principles matter, especially SRP, dependency inversion at boundaries, and open/closed extensibility without speculative abstraction.

3. JavaScript and TypeScript style.
   - Prefer expressive functional collection transforms such as `map`, `filter`, `flatMap`, `reduce`, `some`, `every`, `find`, `Object.entries`, generator functions, and `Iterable` helpers when they make data flow clearer.
   - Avoid defaulting to `if` and `for` for simple collection transformations.
   - Keep this preference pragmatic: loops and early returns are fine for complex branching, async sequencing, mutation-heavy code, performance-sensitive hot paths, and when functional chaining would obscure intent.
   - Types should describe contracts, not silence the compiler.

4. Tests and verification.
   - Changed behavior should have a focused test or a clear reason tests are not practical.
   - Tests should assert behavior, not implementation trivia.
   - Missing tests are findings when they would catch a likely regression.

5. Security and operations.
   - Watch for secrets, injection, unsafe parsing, auth bypass, SSRF, XSS, CSRF, path traversal, broken rate limits, and logging sensitive data.
   - Review agent/tool surfaces when relevant: MCP or tool-call boundaries, untrusted tool output, prompt-injection exposure, destructive side effects, least privilege, and approval requirements.
   - Check observability, error messages, rollback safety, and operational failure modes when relevant.

## Output Shape

```text
Findings
- [Severity] file:line - Issue, impact, and concrete fix direction.

Open Questions
- <only if needed>

Summary
- <short change summary or "No findings">

Tests
- <what was reviewed or what is missing>
```

Severity order: `Blocker`, `High`, `Medium`, `Low`, `Note`.

## Do Not

- Do not bury findings after praise or a long summary.
- Do not nitpick style when behavior, tests, or architecture risks are present.
- Do not demand functional style when a loop is clearer.
- Do not apply SOLID as ceremony; use it to expose real responsibility or dependency problems.
