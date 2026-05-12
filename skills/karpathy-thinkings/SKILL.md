---
name: karpathy-thinkings
description: Use when coding, reviewing, refactoring, debugging, or planning implementation work where the agent should follow Andrej Karpathy-style coding agent discipline: think before coding, avoid silent assumptions, prefer simple solutions, make surgical changes, and define verifiable success criteria before calling work done.
---

# Karpathy Thinkings

Use this skill to apply the Karpathy-style coding agent mindset directly during implementation work. The goal is not generic code style. The goal is to prevent the failure modes Karpathy called out in AI coding agents: silent assumptions, hidden confusion, overbuilt abstractions, unrelated edits, and weak verification.

This is an unofficial local adaptation for this skills repo. It is inspired by public Karpathy coding-agent guidance and the community `andrej-karpathy-skills` package, but this repo keeps its own wording and validation.

Read `references/source-notes.md` when updating this skill, explaining its origin, or deciding how close to the public wording it should stay.

## Core Principles

### 1. Think Before Coding

- Do not silently choose an interpretation when the request is ambiguous.
- State relevant assumptions before editing.
- Surface tradeoffs when there are multiple reasonable paths.
- Push back when the requested path is needlessly complex or risky.
- Ask a focused question when the missing detail changes the implementation.

### 2. Simplicity First

- Implement the smallest solution that satisfies the user's actual goal.
- Do not add speculative features, configuration, extension points, or abstractions.
- Do not turn one-off logic into framework-shaped machinery.
- Prefer boring code that fits the existing project.
- If the implementation becomes much larger than the problem, stop and simplify.

### 3. Surgical Changes

- Touch only files and lines that connect to the task.
- Do not refactor adjacent code just because it looks improvable.
- Match the existing style even when you would normally choose another style.
- Clean up only the unused imports, variables, files, or comments created by your own change.
- Mention unrelated issues separately instead of fixing them silently.

### 4. Goal-Driven Execution

- Convert the task into concrete success criteria before declaring completion.
- For bugs, reproduce or characterize the failure before fixing when practical.
- For validation work, define the failing case first, then make it pass.
- For refactors, identify the behavior that must stay unchanged.
- Run the smallest meaningful verification loop and report what passed or could not be run.

## Workflow

1. Restate the task as behavior and success criteria.
2. Identify ambiguity, assumptions, and the simplest credible approach.
3. Inspect the relevant code before editing.
4. Make the smallest surgical change.
5. Verify against the success criteria.
6. If verification fails, narrow the cause before expanding the solution.
7. Report the change, validation, and any unresolved uncertainty.

## When To Ask

Ask before coding when:

- two interpretations produce different code,
- the requested change conflicts with existing architecture or tests,
- the safest fix requires changing behavior outside the requested scope,
- the success criteria cannot be inferred from the task,
- a rewrite, abstraction, dependency, or migration seems necessary.

## Interaction With Other Skills

- Use `project-structure` when the task is mainly about choosing or changing project layout.
- Use `atomic-committer` only when the user asks to commit or push.
- Use `skill-update` when the thing being changed is an existing skill.
- Use `sync-docs` when the main issue is stale or conflicting documentation.
- Use `web-research` only when current external facts are needed.

## Final Report

Keep the final answer compact:

```text
Changed
- <what changed and why>

Validation
- <command or check>: <result>

Notes
- <assumption, tradeoff, or unresolved issue if relevant>
```

Do not narrate every internal thought. Surface only the assumptions, tradeoffs, and validation that matter to the user.
