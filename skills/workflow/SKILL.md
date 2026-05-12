---
name: workflow
description: Use when the user asks to design, run, review, or document a project workflow; start a new project or feature; turn an idea into domain docs, ADRs, PRDs, issues, implementation plans, TDD cycles, QA, document sync, and ship steps; decide which planning or implementation skill should run next; or prevent agents from coding before product, architecture, and issue boundaries are clear.
---

# Workflow

Use this skill to guide a front-loaded AI coding workflow. The goal is to keep agents from starting with code before the product language, architecture choices, issue boundaries, implementation plan, and verification gates are explicit. Keep the workflow portable across Codex, Claude, Cursor, Windsurf, Copilot, and other agents by treating each agent's instruction files, rules, hooks, skills, workflows, memories, and subagents as runtime adapters rather than as the workflow itself.

Load `references/project-workflow-playbook.md` when the user asks for a complete project plan, a feature workflow, issue sequencing, subagent-assisted implementation, or a workflow audit.

Load `references/upstream-dependency-map.md` when checking whether the source workflow still matches Matt Pocock, GStack, Superpowers, design-direction, or repo-local helper skills; when a source skill may have updated; or when auditing duplicate workflow stages, direction quality, PRD handoffs, or mockup selection.

## Dependency Contract

This skill is an orchestration skill. It depends on other skill families when the target project has them installed or linked. Before running the workflow, make a dependency inventory:

```text
Matt Pocock-style skills: setup-matt-pocock-skills, grill-me, grill-with-docs, to-prd, to-issues, triage, review, diagnose, document-sync, improve-codebase-architecture, semantic-commits, ship
GStack-style skills: office-hours, plan-ceo-review, product/spec review skills
Superpowers-style skills: brainstorming, writing-plans, plan-eng-review, plan-design-review, subagent-driven-development, tdd or test-driven-development, verification-before-completion
Design skills: design-consultation, design-shotgun, design-review, browser-qa
Repo-local helpers: project-structure, sync-docs, atomic-committer, agent-eval-harness
```

Rules:

- Do not claim a dependent skill was used unless that skill is actually available in the target runtime or project instruction file.
- If a dependent skill is available, prefer calling or following that exact skill over rewriting its behavior from memory.
- If a dependent skill is missing, state the missing dependency and either ask whether to install/link it or run an explicit fallback equivalent.
- Do not install, symlink, or globally register missing dependencies unless the user explicitly asks.
- Record dependency status in the workflow output as `available`, `missing`, or `fallback`.
- When a source dependency changes, update this skill only at the orchestration boundary: dependency inventory, stage order, artifact handoff, conflict handling, validator checks, snippets, and `skill.html`. Do not copy a source skill's full behavior into `workflow`.

## Core Contract

- Do not start with code when the task is still an idea, product scope, architecture choice, or unclear issue.
- Read project instructions first: `AGENTS.md`, `CLAUDE.md`, or equivalent. Then read domain docs, ADRs, issue tracker docs, testing docs, and `design.md` only when relevant.
- Before relying on agent-specific behavior, identify the active adapter surface: Codex `AGENTS.md`/skills/hooks/subagents, Claude `CLAUDE.md`/rules/hooks/subagents, Cursor `.cursor/rules` or `AGENTS.md`, Windsurf `AGENTS.md`/`.windsurf/rules`/workflows/skills, Copilot `.github/copilot-instructions.md`, or a project-specific equivalent.
- Preserve the original direct-use workflow names when those skills exist in the target project: `setup-matt-pocock-skills`, `grill-me`, `grill-with-docs`, `office-hours`, `plan-ceo-review`, `to-prd`, `to-issues`, `triage`, `brainstorming`, `writing-plans`, `plan-eng-review`, `plan-design-review`, `subagent-driven-development`, `tdd`, `review`, `qa`, `diagnose`, `document-sync`, `improve-codebase-architecture`, `semantic-commits`, and `ship`.
- Fix domain language before stack choices. Fix stack and app boundaries in ADRs before PRD and issue decomposition.
- Do not call `project-structure` during raw idea discovery. Call it only after domain language exists and the project kind, runtime, app boundary, API, persistence, and deployment questions are concrete enough to evaluate. Use it during the architecture decision pass to draft or validate the folder/env/codegen/db/infra structure, then record the selected structure in ADRs before PRD.
- Do not run `to-prd` as a generic writing step. First set PRD inputs, language, path, and validation criteria: `CONTEXT.md`, ADRs, `office-hours` product challenge, CEO/spec review, and relevant `.scratch/<feature-slug>/specs/` docs feed `.scratch/<feature-slug>/PRD.md`; PRD prose defaults to Korean while code-facing canonical terms stay English; included scope, excluded scope, first usable slice, stack reference, and data source of truth must be explicit.
- Use project-local source-of-truth files first. Use web research only when current external docs, official APIs, or third-party tool behavior must be verified.
- When current agent behavior matters, verify it from official docs and record the checked date in the workflow log or planning artifact.
- Keep workflow artifacts in the project’s chosen workflow area. If the project follows this repo’s default pattern, use `.scratch/<feature-slug>/`.
- Prefer vertical slices over horizontal setup work. A good first implementation issue proves real input -> persistence -> API or command boundary -> user-visible output.
- Keep UI design rules explicit before frontend implementation. If there is user-facing UI, read or create `design.md` before coding screens.
- Keep product challenge, implementation brainstorming, and visual mockup selection separate. Product challenge asks whether and what to build; implementation brainstorming narrows how to build one issue; visual mockup selection compares UI directions before implementation.
- When GStack-style skills are available, use `office-hours` and product/spec review skills for product challenge before PRD. When they are not installed, run the same review questions manually and record the result as an equivalent product challenge artifact.
- When Superpowers-style skills are available, use implementation `brainstorming` after issue triage and before writing implementation plans. Do not use it as a substitute for product validation.
- For substantial UI, present two or three mock design directions, ask the user to select or combine one, then record the chosen direction in `design.md`, the issue/spec, and a mockup decision artifact before coding the UI.
- Favor direction quality over speed. The source workflow intentionally spends time on domain, product, PRD, plan, design, and mock direction before code.
- Use TDD as behavior cycles, not as one giant test batch: `RED -> GREEN -> REFACTOR`.
- When subagents are available and explicitly appropriate, separate roles: Unit Test Agent writes failing tests, Implementer Agent changes production code, Verifier Agent checks spec and test quality.
- Log major workflow decisions in the project’s workflow log. Do not rely on chat history as the durable record.
- If the next source of truth is missing or contradictory, ask a focused question before inventing architecture or scope.

## Mode Router

Choose one mode before acting:

| User situation | Mode | First action |
| --- | --- | --- |
| “I have an idea/new project” | Discovery | Use `grill-me`; use `grill-with-docs` if existing docs/code already exist |
| “Which stack/structure?” | Architecture | Use `grill-with-docs`, then `plan-eng-review` when needed; write ADR |
| “Make a PRD/issues” | Product planning | Use `office-hours`, `plan-ceo-review`, `to-prd`, `to-issues`, then `triage` |
| “Start implementing this issue” | Implementation | Use `brainstorming`, `writing-plans`, `plan-eng-review`, then TDD |
| “Is this workflow going well?” | Workflow audit | Compare docs, issues, plan, tests, UI evidence, and workflow log |
| “Implementation is done” | Completion | Use `review`, `qa`, `diagnose` if needed, `document-sync`, architecture cleanup, then commit/ship |
| “Make this work in Codex/Claude/Cursor/Windsurf/Copilot” | Portability setup | Pick the instruction/rule/workflow surface and write the smallest adapter snippet |

## Default Flow

```text
setup-matt-pocock-skills
-> grill-me or grill-with-docs
-> CONTEXT.md
-> technology stack pass with grill-with-docs
-> project-structure for folder/env/codegen/db/infra boundaries
-> ADRs record selected structure
-> office-hours
-> plan-ceo-review
-> PRD
-> vertical slice issues
-> triage
-> brainstorming
-> writing-plans
-> plan-eng-review
-> plan-design-review plus design-consultation/design-shotgun or mockup selection when UI exists
-> subagent-driven-development plus tdd
-> review, QA, diagnose
-> document-sync
-> improve-codebase-architecture
-> semantic-commits, ship when requested
```

Direct-use order copied from the source workflow:

```text
0. setup-matt-pocock-skills
1. grill-me or grill-with-docs
2. grill-with-docs for technology stack decision; plan-eng-review if needed
3. office-hours
4. plan-ceo-review
5. to-prd with PRD settings locked
6. to-issues
7. triage
8. brainstorming
9. writing-plans
10. plan-eng-review
11. design.md, visual mockup pass, plan-design-review for UI work
12. subagent-driven-development + tdd
13. review, qa, diagnose
14. document-sync
15. improve-codebase-architecture
16. semantic-commits, ship when requested
```

Run a cross-agent portability pass whenever the workflow is meant to be reused outside the current runtime:

```text
shared workflow contract
-> active agent adapter surface
-> project snippet or rule target
-> current official-doc check if behavior is runtime-specific
-> agent-eval-harness seed cases when the workflow must stay reliable
```

## Artifact Map

Use project-local names when they exist. Default names:

```text
CONTEXT.md
docs/adr/
docs/agents/
design.md
.scratch/<feature-slug>/
  PRD.md
  WORKFLOW_LOG.md
  issues/
  specs/
  plans/
  artifacts/
    screenshots/
    logs/
```

## PRD Settings

Before calling `to-prd`, lock these settings:

```text
Path: .scratch/<feature-slug>/PRD.md
Inputs: CONTEXT.md, docs/adr/, office-hours result, CEO/spec review, relevant .scratch/<feature-slug>/specs/
Language: Korean prose by default
Canonical terms: keep code-facing domain terms in English
Must include: first usable slice, included scope, excluded scope, source of truth, ADR stack reference
Must not include: a new stack choice that bypasses ADR, hidden scope expansion, stale product assumptions
```

The PRD becomes the authority for `to-issues`. If the inputs disagree, stop and ask a focused question instead of smoothing over the conflict.

## Skill Coordination

- Use `project-structure` only after domain language and architecture questions are concrete enough to choose or validate structure; do not use it as the first idea-discovery step. Record the selected structure through this workflow and ADRs.
- Use `web-research` only for current external facts, official docs, tool versions, or third-party behavior.
- Use `design-review` before UI implementation and after browser evidence exists.
- Use `browser-qa` for runtime UI evidence, screenshots, console, network, accessibility, and text overlap.
- Use `code-review` after implementation or when a plan/diff needs findings-first risk review.
- Use `sync-docs` after implementation, QA, or HITL feedback to keep docs aligned.
- Use `agent-eval-harness` when workflow routing, cross-agent instruction portability, guardrails, or repeated agent behavior must be regression-tested.
- When handing off to `agent-eval-harness`, seed cases for workflow routing, dependency inventory, `project-structure` timing, PRD settings, UI mockup selection, document-sync, and artifact hygiene.
- Use `atomic-committer` only when the user asks to commit or push.

## Output Shape

For workflow planning or audits, answer in this shape:

```text
Workflow
- Mode: discovery | architecture | product planning | implementation | audit | completion
- Current authority: <docs/files read or missing>
- Runtime adapter: <Codex AGENTS.md | Claude CLAUDE.md | Cursor rules | Windsurf rules/workflow | Copilot instructions | unknown>
- Dependencies: <available/missing/fallback skill families and direct skill names>
- Next step: <one concrete step>

Artifacts
- Create/update: <paths>
- Preserve: <historical plan/spec/logs that should not be rewritten>

Validation
- Required checks: <commands or browser/manual checks>
- Done when: <observable success criteria>

Open
- <only source-of-truth conflicts or questions that block the next step>
```

## Do Not

- Do not skip domain language and ADRs just because the tech stack feels obvious.
- Do not split issues as DB-only, API-only, or UI-only unless the project explicitly needs an enabling task.
- Do not let an implementer weaken tests written for RED without controller review.
- Do not put screenshots, logs, or temporary QA output in the repo root.
- Do not rewrite historical plans/specs as if they were current truth. Add current decisions to workflow log or current docs instead.
- Do not assume hooks, memories, skills, workflows, or subagents behave the same across agents. Confirm the active runtime surface before encoding workflow automation.
