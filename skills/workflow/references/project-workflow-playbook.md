# Project Workflow Playbook

Use this reference when the user wants a full project workflow, a feature workflow, or an audit of whether the current work is following the intended process.

## Core Idea

The workflow is intentionally front-loaded:

```text
도메인 언어를 먼저 고정한다
-> 구조 선택이 필요할 만큼 질문이 좁혀지면 project-structure로 tree를 검토한다
-> 기술 스택과 app boundary를 ADR로 확정한다
-> 제품 범위를 검증한다
-> PRD와 issue로 쪼갠다
-> 첫 vertical slice를 TDD로 구현한다
```

This playbook does not hard-code one technology stack. It hard-codes the order of decisions. Stack choices such as Bun, Turborepo, Next.js, NestJS, Fastify, GraphQL, SQLite, Drizzle, or any alternative must be project-specific architecture decisions recorded in ADRs.

## Read Order

When present, read these before planning:

1. Project instruction file: `AGENTS.md`, `CLAUDE.md`, or equivalent.
2. Domain context: `CONTEXT.md` or equivalent glossary/product context.
3. Architecture decisions: `docs/adr/`.
4. Workflow and issue rules: `docs/agents/`, issue tracker docs, triage labels.
5. Structure and testing docs: root docs first, then workspace-local `AGENTS.md`, `docs/structure.md`, and `docs/testing.md`.
6. UI design source: `design.md` before frontend implementation.

If files are missing, do not automatically create all of them. Create only the next durable artifact needed for the current workflow stage.

## Dependency Inventory

Run this before the canonical workflow. The source workflow is a composition of external skill families, not a single self-contained procedure.

| Skill family | Direct skill names | Required for | Missing dependency handling |
| --- | --- | --- | --- |
| Matt Pocock-style | `setup-matt-pocock-skills`, `grill-me`, `grill-with-docs`, `to-prd`, `to-issues`, `triage`, `review`, `diagnose`, `document-sync`, `improve-codebase-architecture`, `semantic-commits`, `ship` | setup, domain language, PRD/issues, review, diagnosis, docs, architecture cleanup, commit/ship | Ask whether to install/link the skill or run a clearly labeled fallback |
| GStack-style | `office-hours`, `plan-ceo-review`, product/spec review skills | product challenge and scope pressure test | Do not skip; run the same product challenge questions as fallback if approved or implied |
| Superpowers-style | `brainstorming`, `writing-plans`, `plan-eng-review`, `plan-design-review`, `subagent-driven-development`, `tdd` or `test-driven-development`, `verification-before-completion` | implementation spec, TDD plan, plan review, subagent TDD | Use a small manual plan/TDD loop only after marking it as fallback |
| Design direction | `design-consultation`, `design-shotgun`, `design-review`, `browser-qa` | mock directions, design lock, browser evidence | Produce 2-3 mock directions and ask the user to choose; verify with available design/browser skill |
| Repo-local helpers | `project-structure`, `sync-docs`, `atomic-committer`, `agent-eval-harness` | local structure, docs sync, commit grouping, eval cases | Use only when available in the current skills repo or project snippets |

Dependency status format:

```text
Dependencies
- Matt Pocock-style: available | missing | fallback
- GStack-style: available | missing | fallback
- Superpowers-style: available | missing | fallback
- Design direction: available | missing | fallback
- Repo-local helpers: available | missing | fallback
```

Never hide missing dependencies by silently renaming the step. If the user asked for the original workflow, preserve the original skill call names and make dependency gaps visible.

## Stage Guide

| Stage | Direct skill call | Purpose | Typical artifact |
| --- | --- | --- | --- |
| 0. Project setup | `setup-matt-pocock-skills` | Establish agent rules, issue tracker shape, docs language, workflow artifact folders | `AGENTS.md`, `docs/agents/` |
| 1. Domain language | `grill-me` or `grill-with-docs` | Interview or review docs to extract product flow and canonical terms | `CONTEXT.md` |
| 2. Architecture decision | `grill-with-docs`; `project-structure` after domain context; `plan-eng-review` if needed | Decide runtime, package manager, app boundary, API, persistence, worker, test strategy, and validate the project tree before ADR lock | `docs/adr/0001-*.md`, optional `docs/structure.md` |
| 3. Product challenge | `office-hours` | Check the smallest useful slice and remove weak scope | `.scratch/<feature>/specs/*-product-challenge.md` |
| 4. CEO/product review | `plan-ceo-review` | Separate must-have MVP from later work | `.scratch/<feature>/specs/*-ceo-review.md` |
| 5. PRD | `to-prd` | Convert context, ADR, office-hours, CEO/spec review, and feature specs into locked requirements | `.scratch/<feature>/PRD.md` |
| 6. Issue split | `to-issues` | Break PRD into vertical slice issues | `.scratch/<feature>/issues/NN-*.md` |
| 7. Triage | `triage` | Mark issue as ready, blocked, needs-info, or human-only | issue status line |
| 8. Implementation brainstorming | `brainstorming` | Narrow behavior, file boundary, UI state, and test boundary for one ready issue | `.scratch/<feature>/specs/*-implementation-design.md` |
| 9. Implementation plan | `writing-plans` | Write executable TDD tasks with exact files and commands | `.scratch/<feature>/plans/*.md` |
| 10. Engineering review | `plan-eng-review` | Check plan against ADR, module boundary, data flow, tests | review note or plan comments |
| 11. UI design and mockup selection | `plan-design-review`; `design-consultation` or `design-shotgun` when available | Lock UI tokens, compare mock directions, select or combine one, and record decisions before UI code | `design.md`, design review notes, mockup decisions |
| 12. TDD implementation | `subagent-driven-development` + `tdd` | Execute behavior cycles with role separation | code, tests, workflow log |
| 13. Review/QA/diagnose | `review`, `qa`, `diagnose` | Review diff, verify browser/runtime behavior, diagnose failures | review findings, QA artifacts |
| 14. Document sync | `document-sync` | Align current docs with code, UI evidence, and HITL feedback | updated docs and log |
| 15. Architecture improvement | `improve-codebase-architecture` | Refactor coupling and duplication after real slice exists | code changes, ADR follow-up |
| 16. Commit/ship | `semantic-commits`; `ship` when requested | Group atomic commits, push or release only when requested | commits, PR/release notes |

## Canonical Direct-Use Order

This order comes from the source `WORKFLOW.md`. Keep the names visible so an agent can call the installed skills instead of replacing them with vague generic steps.

```text
0. setup-matt-pocock-skills
1. grill-me or grill-with-docs
2. technology stack decision with grill-with-docs; plan-eng-review if needed
2a. project-structure only after domain context makes the structure question concrete
3. office-hours
4. plan-ceo-review
5. to-prd after PRD settings are locked
6. to-issues
7. triage
8. brainstorming
9. writing-plans
10. plan-eng-review
11. design.md check, visual mockup pass, plan-design-review
12. subagent-driven-development + tdd
13. review, qa, diagnose
14. document-sync
15. improve-codebase-architecture
16. semantic-commits, ship when requested
```

## Technology Decision Pass

Run this after domain context exists and before PRD:

```text
1. runtime: Node.js, Bun, browser, worker, desktop, or other
2. package manager and root task runner
3. repo shape: single app, monorepo, Turborepo, package workspace
4. frontend framework and rendering model
5. backend boundary: framework route handlers, separate server, local CLI, desktop bridge
6. API boundary: REST, GraphQL, RPC, direct local call, command boundary
7. persistence: SQLite, Postgres, file storage, external service
8. ORM/query layer
9. worker/CLI and service reuse
10. auth, deployment, and multi-user scope
11. external services and whether runtime calls them directly
12. unit, integration, e2e, browser, and manual QA boundaries
```

ADR must include selected choice, rejected alternatives, rationale, consequences, and explicit MVP exclusions.

## Project Structure Handoff

`project-structure` is a specialist skill, not the first step of `workflow`.

Use it only after `grill-me` or `grill-with-docs` has produced enough domain language to make the architecture question real. The handoff is appropriate when the workflow must choose or validate frontend/backend/full-stack/desktop shape, app boundaries, env layout, GraphQL codegen, DB migration ownership, cache boundaries, Tauri build shape, or infrastructure folders.

Do not use `project-structure` during raw idea discovery, product challenge, PRD prose writing, or issue triage. In those phases, keep asking product and domain questions until structure choices are constrained.

Handoff sequence:

```text
CONTEXT.md exists or is being drafted
-> architecture questions are concrete
-> project-structure proposes or audits tree/env/codegen/db/infra boundaries
-> ADR records selected structure and rejected alternatives
-> PRD references ADR instead of inventing stack or folders
```

If `project-structure` is missing, record the dependency as `missing` or `fallback`, write only the minimal structure decision needed for the ADR, and do not generate a broad folder tree from memory.

## PRD Settings

Set these before `to-prd`. Do not treat PRD writing as freeform summarization.

| Setting | Required value |
| --- | --- |
| Output path | `.scratch/<feature-slug>/PRD.md` |
| Required inputs | `CONTEXT.md`, `docs/adr/`, `office-hours` result, `plan-ceo-review` or equivalent spec review, and relevant `.scratch/<feature-slug>/specs/` docs |
| Language | Korean by default unless the user explicitly asks otherwise |
| Canonical terms | Keep code-facing domain terms in English, matching `CONTEXT.md` |
| Scope lock | Include explicit included scope, excluded scope, and first usable slice |
| Architecture lock | Reference ADR choices; do not invent a new stack, app boundary, persistence model, or runtime inside the PRD |
| Data lock | Name the data source of truth and whether sample/mock data is allowed |
| Downstream use | `to-issues` reads `.scratch/<feature-slug>/PRD.md` and splits vertical slices from it |

PRD validation checklist:

- The first usable slice is described in one sentence.
- Included and excluded scope are separate.
- The PRD references ADRs for stack and app boundary.
- The PRD does not override `office-hours` or CEO/spec review without saying why.
- Data source of truth is clear.
- Canonical domain terms match `CONTEXT.md`.

## External Skill Family Mapping

This workflow can call external skill families when a project has them installed, but it must still work without them.

| Workflow concern | Preferred skill family | When to use | Fallback when unavailable |
| --- | --- | --- | --- |
| Domain language and DDD boundaries | Matt Pocock-style `grill-me`, `grill-with-docs`, `zoom-out` | Before stack and PRD decisions | Interview the user and write/update `CONTEXT.md` and ADRs directly |
| Product challenge | GStack-style `office-hours`, CEO/spec review | After domain/ADR, before PRD | Ask the office-hours questions manually and write `*-product-challenge.md` |
| Implementation brainstorming | Superpowers-style `brainstorming` | After issue triage, before implementation plan | Write an issue-level implementation design spec with behavior, files, states, and tests |
| Implementation planning | Superpowers-style `writing-plans`, plan review | Before TDD implementation | Write a small TDD plan with exact paths and commands |
| UI direction | `design-consultation`, `design-shotgun`, or design review | Before substantial frontend work | Produce two or three static mock directions, ask the user to choose or combine, then record the decision |

Keep these concerns separate. `office-hours` is not implementation brainstorming, and implementation `brainstorming` is not product validation.

## Product Challenge Questions

Use these for `office-hours` or its fallback:

- Who really wants this?
- How do they solve it now?
- Is this urgent enough for the first usable slice?
- What is the smallest useful version?
- What can be removed without destroying value?
- Is sample/mock data enough, or does the first slice need real data?
- What is the future path after the MVP?

Write the answer to `.scratch/<feature-slug>/specs/<YYYY-MM-DD>-<topic>-product-challenge.md`.

## Visual Mockup Selection Pass

Run this before substantial UI implementation, after `design.md`, implementation brainstorming, implementation plan, and engineering review are stable enough to constrain the mockups.

1. Read `design.md`, the issue, issue-level design spec, implementation plan, and engineering review.
2. Produce two or three distinct mock directions. Each direction must show layout, density, navigation, important states, and which design rules it follows.
3. Present the tradeoffs without treating any option as the default winner.
4. Ask the user to select one direction or combine specific parts.
5. Record the selected direction in `design.md`, the current issue/spec, and `.scratch/<feature-slug>/specs/<YYYY-MM-DD>-<first-slice>-mockup-decisions.md`.
6. Store screenshots or browser QA logs under `.scratch/<feature-slug>/artifacts/`, not in the repo root.

If `design-shotgun` or `design-consultation` exists in the active project, use it for this pass. Otherwise, use the shared `design-review` and `browser-qa` skills with a small static mock, screenshot, or prototype.

## Cross-Agent Portability Pass

Run this whenever the workflow is meant to work outside the current agent runtime. The shared workflow should stay stable; the adapter surface can change per project.

| Runtime | Durable surface | What to verify |
| --- | --- | --- |
| Codex | `AGENTS.md`, repo-linked `SKILL.md`, hooks, subagents | `AGENTS.md` discovery, skill availability, hook approval, and whether subagents were explicitly requested |
| Claude Code | `CLAUDE.md`, `.claude/rules/`, hooks, subagents | memory lookup order, project vs local instructions, hook event limits, and subagent permissions |
| Cursor | `.cursor/rules/*.mdc`, `AGENTS.md` | rule type: always, auto attached, agent requested, or manual; nested rule scope |
| Windsurf | `AGENTS.md`, `.windsurf/rules/*.md`, workflows, skills | rules vs workflows vs skills vs memories, activation mode, character limits, and workspace scope |
| GitHub Copilot | `.github/copilot-instructions.md`, path-specific instructions when supported | short self-contained instructions, repo scope, and code-review instruction limits |
| Other agents | project instruction file, rules, workflow commands, or prompt library | activation semantics, precedence, persistence, and whether the user must call the workflow explicitly |

Portability checklist:

1. Identify which agent will run the workflow and which instruction surface it actually loads.
2. Keep durable shared behavior in repo docs or snippets, not only in personal memory.
3. Keep adapter instructions concise and trigger-focused; put long playbooks in linked docs.
4. If the adapter depends on current external behavior, verify official docs and record `checked: YYYY-MM-DD`.
5. Add an `agent-eval-harness` seed case when the workflow must keep selecting the right skill or next step over time.

Do not copy every runtime-specific feature into the shared workflow. For example, Claude hooks, Codex hooks, Cursor rules, and Windsurf workflows solve overlapping problems but fire at different points and have different approval, context, and persistence behavior.

## Agent Eval Handoff

Use `agent-eval-harness` as a separate validation skill. `workflow` should call it, not absorb it.

Seed these cases when a project relies on repeatable workflow behavior:

| Case family | What to protect |
| --- | --- |
| Workflow routing | New project or feature prompts route to `workflow`, not directly to code or `project-structure`. |
| Dependency inventory | Matt Pocock-style, GStack-style, Superpowers-style, design-direction, and repo-local helpers are marked `available`, `missing`, or `fallback`. |
| Project-structure timing | `project-structure` is called after domain context and architecture questions, before ADR lock and PRD. |
| PRD settings | PRD path, inputs, language, scope lock, architecture lock, and data source of truth are fixed before `to-prd`. |
| Mockup selection | Substantial UI work requires two or three mock directions and a user-selected direction before implementation. |
| Document sync | Completion flow calls `document-sync` and preserves historical plans/specs as historical records. |
| Artifact hygiene | Workflow logs, screenshots, traces, and QA artifacts stay under the project workflow area, not repo root. |

## Vertical Slice Rule

Good first issue:

```text
real input -> persistence -> API/command boundary -> user-visible output
```

Weak first issue:

```text
DB schema only
GraphQL schema only
UI shell only
```

Enabling tasks are allowed only when the user or existing docs make the dependency explicit. Keep them small and immediately followed by a vertical slice.

## TDD Role Separation

When using subagents:

```text
Unit Test Agent: tests/ 아래 실패 test 작성
Controller: RED 확인
Implementer Agent: production code 최소 구현
Controller: GREEN 확인
Verifier Agent: spec, test quality, ownership separation 검토
Implementer Agent: 필요한 refactor
Controller: 관련 전체 test 재실행
```

Rules:

- Unit Test Agent edits test files only.
- Implementer Agent edits production files and must not weaken tests.
- If the implementer believes the test is wrong, report `NEEDS_CONTEXT`; controller decides whether the test agent revises it.
- Do not run multiple agents on the same behavior or same file set at the same time.

## Workflow Log

Record durable stage transitions:

```text
## YYYY-MM-DD | <stage>

- Input:
- Output:
- Decision:
- Validation:
- Commit:
- Follow-up:
```

Use `.scratch/<feature-slug>/WORKFLOW_LOG.md` when the project has no other workflow log convention.

## Completion Gate

Before calling work done, check:

- Product scope still matches PRD and current decisions.
- Architecture and app boundaries still match ADRs.
- Issue acceptance criteria are satisfied.
- Tests cover the changed behavior.
- UI changes have browser evidence when relevant.
- `design.md` and current docs reflect the implemented behavior.
- Historical plans/specs remain historical; current docs and workflow log carry updated truth.
- Commit/push happens only when the user asks for it.
