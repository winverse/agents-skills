# Workflow Upstream Dependency Map

Use this map before running or updating `workflow`. The source workflow is not a standalone method. It composes installed skills from several upstream families and keeps this repo's `workflow` skill as the coordinator.

## Source References

Primary reference artifacts used to build this map:

- `WORKFLOW.md`
- `references/installed-ai-coding-workflow-skills.md`
- `references/ai-coding-workflow-flow-summary.md`
- `references/ai-coding-workflow-1-script.txt`
- `references/ai-coding-workflow-2-script.txt`
- `references/ai-coding-workflow-3-script.txt`
- project-local installed skill folders, each with its own `SKILL.md`

Source family origins recorded by `installed-ai-coding-workflow-skills.md`:

- Matt Pocock skills: `mattpocock/skills`
- GStack skills: `garrytan/gstack`
- Superpowers skills: copied locally from the installed Codex Superpowers plugin cache

When an upstream skill changes, re-read the source skill's `SKILL.md` first. Do not rely on this workflow's summary alone.

## Dependency Ledger

| Family | Source skill | Source package cue | Workflow role | Follow updates by checking |
| --- | --- | --- | --- | --- |
| Matt Pocock | `setup-matt-pocock-skills` | source skill folder named `setup-matt-pocock-skills` | Setup `AGENTS.md`/`CLAUDE.md` agent block, issue tracker rules, triage labels, domain doc layout | setup outputs, issue tracker templates, agent instruction block names |
| Matt Pocock | `grill-me` | source skill folder named `grill-me` | Interview the user to fix domain language, product intent, first usable slice | interview contract, output expectations, when to ask instead of assuming |
| Matt Pocock | `grill-with-docs` | source skill folder named `grill-with-docs` | Challenge an idea against existing docs and update `CONTEXT.md`/ADRs | `CONTEXT-FORMAT.md`, `ADR-FORMAT.md`, update semantics |
| Matt Pocock | `zoom-out` | source skill folder named `zoom-out` | Explain broader system context and architecture fit | when it is used before or after implementation |
| Matt Pocock | `to-prd` | source skill folder named `to-prd` | Turn validated context into PRD | PRD destination, issue tracker publishing behavior, required source inputs |
| Matt Pocock | `to-issues` | source skill folder named `to-issues` | Split PRD/spec into independently grabbable vertical issues | issue shape, tracer-bullet guidance, tracker integration |
| Matt Pocock | `triage` | source skill folder named `triage` | Move issues through ready/blocked/needs-info style state | triage role names, status labels, AFK-agent readiness rules |
| Matt Pocock | `diagnose` | source skill folder named `diagnose` | Reproduce, minimize, hypothesize, instrument, fix, regression-test | diagnosis loop and evidence requirements |
| Matt Pocock | `document-sync` | source skill folder named `document-sync` | Sync markdown docs after planning, code, config, workflow, issue, ADR, or implementation changes | stale-doc detection, conflict handling, historical document rules |
| Matt Pocock | `improve-codebase-architecture` | source skill folder named `improve-codebase-architecture` | Re-check real code against `CONTEXT.md` and ADRs after a vertical slice exists | domain language, interface design, deepening guidance |
| Matt Pocock | `semantic-commits` | source skill folder named `semantic-commits` | Group coherent atomic commits | staging, commit grouping, push behavior |
| Matt Pocock | `ship` | source skill folder named `ship` | Release/PR/ship workflow after verification | release gates, QA checks, PR/release output |
| GStack | `office-hours` | source skill folder named `office-hours` | Product challenge: validate need, remove weak scope, choose smallest useful version | review questions, artifact paths, gbrain/gstack context behavior |
| GStack | `plan-ceo-review` | source skill folder named `plan-ceo-review` | CEO/spec pressure test before PRD and implementation planning | plan review criteria, stale plan handling, output path behavior |
| GStack | `plan-eng-review` | source skill folder named `plan-eng-review` | Engineering plan review and risk check | stack detection, test plan generation, plan artifact search |
| GStack | `plan-design-review` | source skill folder named `plan-design-review` | Designer's-eye plan review before UI implementation | design review criteria, UI artifact expectations |
| GStack | `review` | source skill folder named `review` | Pre-landing PR review and specialist review | specialist routing, plan lookup, design checklist |
| GStack | `qa` | source skill folder named `qa` | Test -> fix -> verify loop | runtime detection, full suite behavior, browser/manual QA behavior |
| GStack | `qa-only` | source skill folder named `qa-only` | Report-only QA without fixing | report format and no-fix boundary |
| GStack | `retro` | source skill folder named `retro` | Learning loop after a work window | commit/session analysis and retrospective outputs |
| Superpowers | `brainstorming` | source skill folder named `brainstorming` | Implementation design before creative work or behavior changes | spec review prompt, visual companion, mandatory pre-implementation use |
| Superpowers | `writing-plans` | source skill folder named `writing-plans` | Lightweight implementation plan before code | plan template, reviewer prompt, exact step format |
| Superpowers | `subagent-driven-development` | source skill folder named `subagent-driven-development` | Execute independent implementation tasks with role separation | implementer/test/spec/code-quality prompts and task ownership |
| Superpowers | `test-driven-development` | source skill folder named `test-driven-development` | Test-first implementation before production code | anti-patterns and implementation ordering |
| Superpowers | `tdd` | source skill folder named `tdd` | Red-green-refactor feature or bugfix loop | tests, mocking, refactoring, interface design guidance |
| Superpowers | `verification-before-completion` | source skill folder named `verification-before-completion` | Evidence before completion claims | verification command proof requirements |
| Design direction | `design-consultation` | project or external design skill when installed | Explore design direction and constraints | available trigger, output artifact, how it updates `design.md` |
| Design direction | `design-shotgun` | project or external design skill when installed | Generate multiple mock directions for user choice | number of options, comparison method, decision capture |
| Repo-local | `design-review` | `skills/design-review/SKILL.md` | Shared fallback for product-aware design review | design-system fit, accessibility, visual hierarchy |
| Repo-local | `browser-qa` | `skills/browser-qa/SKILL.md` | Shared fallback for browser runtime evidence | screenshots, console/network, accessibility, text overlap |

## Update-Following Rule

When any source dependency is updated:

1. Re-read that source dependency's `SKILL.md`.
2. Check whether trigger, required inputs, artifacts, validation, or output shape changed.
3. Update `workflow` only at the orchestration boundary: dependency inventory, stage order, artifact handoff, conflict handling, and validator checks.
4. Do not copy the dependency's full instructions into `workflow`; link/name the dependency and state the handoff.
5. Update `skill.html`, project snippets, and `history/skills.md` if the visible route or dependency contract changed.
6. Run `node skills/workflow/scripts/validate-workflow.ts skills/workflow`.

## Duplicate Boundary Guardrails

Do not merge these stages:

- `grill-me` / `grill-with-docs`: domain language and product intent.
- `office-hours`: product challenge and scope removal.
- `plan-ceo-review`: CEO/spec pressure test after office-hours.
- `to-prd`: locked requirements from validated inputs.
- `to-issues`: vertical implementation tickets from PRD.
- `brainstorming`: implementation design for one ready issue.
- `writing-plans`: executable task plan after brainstorming.
- `plan-eng-review`: engineering risk review of the plan.
- `plan-design-review` / mockup selection: UI direction and visual system review before UI code.
- `subagent-driven-development` / `tdd`: implementation execution.
- `review`, `qa`, `diagnose`: quality and debugging after code exists.
- `document-sync`: align current docs after feedback/code, preserving historical plans.
- `improve-codebase-architecture`: architecture cleanup after a real vertical slice exists.

The names may sound similar, but the authority source and output artifact differ. Keep the boundary visible in the workflow log.

## Direction Over Speed

The source workflow explicitly spends time before code. Optimize for direction quality, not fastest implementation:

- Do not skip domain language because the stack feels obvious.
- Do not write a PRD before product challenge and CEO/spec review.
- Do not write implementation plans before a ready issue and implementation brainstorming.
- Do not implement substantial UI before `design.md`, plan review, and mockup direction selection.
- Do not call work complete before verification evidence and document sync.

## Mockup Direction Gate

For substantial UI, the workflow must let the user pick the direction before implementation.

Required sequence:

1. Read `design.md`, issue/spec, implementation plan, and engineering review.
2. Produce two or three distinct mock directions or use `design-shotgun` when available.
3. Compare layout, density, navigation, state handling, accessibility, and design-system fit.
4. Ask the user to choose one direction or combine specific parts.
5. Record the selection in `design.md`, PRD if scope changed, issue/spec, and `.scratch/<feature-slug>/specs/<YYYY-MM-DD>-<first-slice>-mockup-decisions.md`.
6. Store screenshots and browser QA logs under `.scratch/<feature-slug>/artifacts/`.

When `design-shotgun` or `design-consultation` is missing, state that the workflow is using a fallback mockup direction pass.
