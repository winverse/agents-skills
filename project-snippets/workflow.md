## Project Skills

- Use $workflow at `<skills-root>/skills/workflow/SKILL.md` when asked to design, run, review, or document a project workflow; start a new project or feature; decide the next workflow step; turn an idea into domain docs, ADRs, PRDs, issues, plans, TDD cycles, QA, document sync, or shipping steps; or prevent agents from coding before product and architecture boundaries are clear.

## Project Skill Overrides

- Treat `workflow` as an orchestration skill that depends on external skill families. Before running it, inventory whether Matt Pocock-style, GStack-style, Superpowers-style, and design-direction skills are available, missing, or being handled by explicit fallback.
- If an upstream dependency changes, re-read that dependency's `SKILL.md` and update only the workflow handoff, stage order, artifact path, conflict handling, validator, and visible guide. Do not duplicate the full source skill inside `workflow`.
- When using `workflow`, read the project instruction file first, then domain docs, ADRs, issue tracker docs, testing docs, and `design.md` when relevant.
- When the workflow must run across Codex, Claude, Cursor, Windsurf, Copilot, or another agent, identify that agent's actual instruction/rule/workflow surface before relying on hooks, memories, skills, workflows, or subagents.
- Preserve the source workflow's direct skill order when those skills exist: `setup-matt-pocock-skills` -> `grill-me`/`grill-with-docs` -> `office-hours` -> `plan-ceo-review` -> `to-prd` -> `to-issues` -> `triage` -> `brainstorming` -> `writing-plans` -> `plan-eng-review` -> UI `plan-design-review`/mockup pass -> `subagent-driven-development`/`tdd` -> `review`/`qa`/`diagnose` -> `document-sync` -> `improve-codebase-architecture` -> `semantic-commits`/`ship`.
- Keep project workflow artifacts in the project’s chosen workflow area. If none exists, use `.scratch/<feature-slug>/`.
- Fix domain language before technology choices, and record app boundary and stack choices in ADRs before PRD and issue decomposition.
- Call `project-structure` only after domain language exists and the project kind, runtime, app boundary, API, persistence, env/codegen, DB, or infra questions are concrete enough to evaluate. Use it during architecture decision as a folder/env/codegen/db/infra handoff, then record the selected structure in ADRs before PRD.
- Prefer vertical slices over DB-only, API-only, or UI-only issues unless an enabling task is explicitly justified.
- Keep product challenge, implementation brainstorming, and UI mockup selection distinct: use GStack-style `office-hours` before PRD, implementation `brainstorming` after issue triage, and 2-3 mock directions with user selection before substantial UI coding.
- Prefer direction quality over speed. Do not compress domain, product, PRD, plan, design, and mockup gates just to start coding sooner.
- Use `agent-eval-harness` as a separate validation handoff when the workflow must stay reliable. Seed cases for workflow routing, dependency inventory, `project-structure` timing, PRD settings, UI mockup selection, document sync, and artifact hygiene.
- Use web research only for current external docs, official APIs, tool versions, or third-party behavior that local docs cannot answer.
