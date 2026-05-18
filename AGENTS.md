# Skills Repo Instructions

This repo stores custom agent skills that are applied manually per project. The skills are meant to be reusable across Codex, Claude, and other agents through each project's instruction files.

## Core Rules

- Do not install, symlink, or auto-register repo skills into any agent's global skill directory unless the user explicitly asks.
- Do not treat default agent behavior as preferred when a custom skill in this repo covers the same job.
- Keep this repo as the source of truth for project-selectable skills.
- Configure projects by linking skill `SKILL.md` files from this repo inside each project's agent instruction file, such as `AGENTS.md`, `CLAUDE.md`, or an equivalent file.
- `skill-creator` is not owned by this repo. It is an external system skill at `${CODEX_HOME:-$HOME/.codex}/skills/.system/skill-creator/SKILL.md`.

## Project Skills

These repo-local links make the skills usable for this project without installing them globally.

- Use $show-skills at `skills/show-skills/SKILL.md` when asked to see, list, browse, summarize, choose, compare, or discover the current skills in this repository, or when asked which skill to use for a task.
- Use $web-research at `skills/web-research/SKILL.md` when a task needs current facts, web verification, source comparison, citations, recommendations, product research, laws, regulations, technical documentation lookup, or structured search beyond simple keywords.
- Use $skill-to-html at `skills/skill-to-html/SKILL.md` whenever a skill is created, installed, forked, or updated, so the skill folder gets a diagram-rich `skill.html` beside `SKILL.md`.
- Use $karpathy-thinkings at `skills/karpathy-thinkings/SKILL.md` when coding, reviewing, refactoring, debugging, or planning implementation work that should follow Karpathy-style agent discipline.
- Use $skill-update at `skills/skill-update/SKILL.md` when asked to update, revise, improve, maintain, rename, split, deprecate, or otherwise change an existing shared skill.
- Use $atomic-committer at `skills/atomic-committer/SKILL.md` when asked to commit, split changes into commits, create multiple logical commits, or commit and push.
- Use $pull-request at `skills/pull-request/SKILL.md` when asked to prepare, create, update, draft, or manage a GitHub pull request, including PR title/body, base/head branch, reviewers, labels, milestones, linked issues, or `gh pr create`.
- Use $project-structure at `skills/project-structure/SKILL.md` when asked to choose, create, standardize, or refactor frontend, backend, full-stack monorepo, desktop app, infrastructure-aware folder structures, or folder-local `AGENTS.md` indexes.
- Use $project-workflow at `skills/project-workflow/SKILL.md` when asked to start a new project or major initiative; shape a raw idea into domain docs, product challenge notes, ADR, `design.md`, PRD, initial issue backlog, project setup verification, or a ready handoff to spec implementation; or prevent agents from coding before product and architecture boundaries are clear.
- Use $spec-workflow at `skills/spec-workflow/SKILL.md` when asked to implement an existing PRD, issue, spec, bug report, acceptance criteria, ADR, or `design.md` through planning, TDD or characterization checks, review, QA/runtime evidence, document sync, and completion reporting.
- Use $sync-docs at `skills/sync-docs/SKILL.md` when asked to review, refresh, reconcile, or update documentation by comparing existing docs, snippets, history, skills, root or folder-local `AGENTS.md` indexes, and repo instruction files.
- Use $transcript-polisher at `skills/transcript-polisher/SKILL.md` when asked to review, polish, or rewrite transcript text, lecture scripts, subtitles, meeting notes, or long prose by directly reading context, especially when scripted replacement is forbidden, source/output transcript structure must be preserved, or Claude Code `/goal`-style completion evidence is requested.
- Use $terminal-session-automation at `skills/terminal-session-automation/SKILL.md` when asked to automate, configure, debug, or document cmux, Warp, or generic terminal session workflows, including Codex/Claude/OpenCode prompt pinning, tab title, session status, workspace boards, terminal workflows, hook latency, and terminal-specific CLI or escape-sequence behavior.
- Use $agent-improvement-loop at `skills/agent-improvement-loop/SKILL.md` when asked to use spare token or context budget productively, improve agent skill usage, make skills easier to invoke, add or review validators, align documentation with source files, create self-improvement loops, or raise repo quality through tests, hooks, docs, evals, and review automation.
- Use $agent-eval-harness at `skills/agent-eval-harness/SKILL.md` when asked to set up, scaffold, configure, or improve an evaluation harness for agent skills, agent instructions, prompt routing, cross-agent portability, tool choice, guardrails, artifact hygiene, or repeatable AI-agent workflows.
- Use $browser-qa at `skills/browser-qa/SKILL.md` when asked to verify browser runtime behavior, Playwright checks, screenshots, console or network output, accessibility snapshots, broken links, responsive layout, text overlap, or `skill.html` rendering.
- Use $code-review at `skills/code-review/SKILL.md` when asked for code review, PR review, diff review, implementation audit, regression risk review, missing test review, maintainability review, or JS/TS style review.
- Use $design-review at `skills/design-review/SKILL.md` when asked for design review, UI review, visual critique, design-system fit, accessibility review, responsive design review, visual hierarchy review, or product-aware design judgment.

## Project Skill Overrides

- Use repo-linked custom skills before default/global agent behavior when the behavior overlaps.
- When using `show-skills`, prefer `node skills/show-skills/scripts/show-skills.ts` for the live list and `docs/skill-catalog.md` for the static human catalog; keep `skills/show-skills/skill.html`'s generated catalog block in sync with `node skills/show-skills/scripts/update-html-catalog.ts skills/show-skills`; do not install or globally register skills while listing them.
- Treat `web-search`, `web search`, `웹서치`, and `웹 검색` as aliases for `web-research`.
- When using `web-research`, automatically use parallel sub-agent fan-out by default whenever the runtime permits delegation. Use a single-agent research path only when the user explicitly asks for single-agent research, private data is involved, runtime/tool policy blocks delegation, or the task is a tiny official quick check.
- When using `karpathy-thinkings`, think before coding, avoid silent assumptions, prefer simple implementations, make surgical changes, and verify success criteria.
- When using `atomic-committer`, scan candidate commits for forbidden secret-bearing content, hard-block live-looking credential assignments and private-key material across common providers, update `.gitignore` for repeatable untracked local or secret-bearing artifacts that should never be committed, group dirty files by logical changeset, write commit messages with an English conventional prefix and Korean summary, and push only when a remote exists and push was requested.
- When using `pull-request`, check branch/base/head/remote state, `gh auth status`, and existing PR state before creating or updating a PR; run `gh pr create` only when the user explicitly asks to create a PR, and never merge, close, reopen, delete branches, enable auto-merge, or force-push without an explicit request.
- When leaving a PR in this repo, use `.github/pull_request_template.md` or the same shape: Korean title/body, summary, changed files or scope, validation commands, risk/rollback notes, and linked issues. For skill changes, state that repo-owned Markdown skill documents under `skills/**/*.md` are Korean-first and list `node scripts/validate-korean-markdown.ts .` in validation.
- When using `skill-update`, keep `SKILL.md`, references, validators, `agents/openai.yaml`, `skill.html`, snippets, docs, and history aligned when behavior changes, and regenerate the `show-skills` HTML catalog after skill add/remove/rename/archive/restore operations.
- When using `project-structure`, default to Bun, Turborepo, Next.js, NestJS with Fastify, GraphQL, urql, GraphQL Code Generator, PostgreSQL + Drizzle, Panda CSS with headless UI, Tauri, Zod env validation, and Pulumi/Docker/AWS ECR/ECS Fargate when infrastructure is requested unless the project says otherwise.
- When using `project-structure`, use MongoDB + Atlas when MongoDB/document DB is selected, and Supabase Postgres when managed psql-compatible Postgres is selected. Keep Supabase service-role keys and MongoDB URIs server-only.
- When using `project-structure`, keep app env/codegen paths consistent and place monorepo Redis boundaries in `packages/db/src/redis`, with API cache wrappers under `apps/api/src/providers/cache`.
- When using `project-structure`, show selected test, security, health/readiness, observability, Panda CSS, GraphQL generated artifact, and Drizzle migration boundaries in the final tree.
- When using `project-structure`, show agent tool, MCP, external API, DB shell, migration, deploy script, destructive command, secret, and scrubbed artifact boundaries when they are part of the structure.
- When using `project-structure`, show `infra/pulumi`, app-local Dockerfiles, AWS ECR image ownership, and one selected AWS runtime path, ECS Fargate or EC2 Docker host, only when infrastructure or deployment structure is requested.
- When using `project-structure` with infrastructure, show the public entrypoint choice, required secret names, Pulumi stack config examples without live values, immutable image tag handoff, and a post-deploy smoke check.
- When using `project-structure`, add short folder-local `AGENTS.md` indexes for meaningful boundary folders such as `apps/web`, `apps/api`, `packages/db`, and `infra/pulumi`; keep them as table-of-contents files with purpose, local map, do-not-change boundaries, related skills, and validation commands rather than copied root rules.
- When a request is raw product discovery, domain modeling, PRD/issues, new-project planning, project setup, project structure choice, or design baseline setup, use `project-workflow` before `project-structure` or `spec-workflow`.
- When using `project-workflow`, treat it as a source-labeled setup skill: choose only needed primitives from Matt Pocock skills, GStack plugin, design-direction, and repo-local custom helpers; mark each as `selected`, `skipped`, or `fallback`. Label borrowed names with their source package, for example Matt Pocock skills `grill-me`, GStack plugin `office-hours`, repo-local custom `project-structure`, and user custom `design.md`.
- Treat `project-workflow` plus `spec-workflow` as the Workflow suite: setup writes durable authority and a lightweight `.scratch/<slug>/workflow-state.md` cache, while implementation reads and updates that cache with evidence and open questions.
- When `project-workflow` needs folder/env/codegen/db/infra structure, call `project-structure` only after domain language and concrete architecture questions exist; use it as an architecture handoff before ADR/PRD, not as raw idea discovery.
- When a PRD, issue, spec, bug report, acceptance criteria, ADR, or `design.md` already exists and the user wants implementation, use `spec-workflow`.
- When using `spec-workflow`, treat it as a source-labeled repeated implementation loop: choose only needed primitives from Superpowers plugin, GStack plugin, Matt Pocock skills, and repo-local helpers; mark each as `selected`, `skipped`, or `fallback`. Label borrowed names with their source package, for example Superpowers plugin `writing-plans`/`tdd`/`subagent-driven-development`, GStack plugin `plan-eng-review`, Matt Pocock skills `diagnose`, and repo-local `code-review`/`browser-qa`/`sync-docs`.
- When documenting `spec-workflow` TDD enforcement, keep this repo docs-only: do not add or run TDD hooks here. Target code repos may opt into project-local hooks that require RED evidence, characterization evidence, or an explicit TDD exception before production code edits.
- When `spec-workflow` lacks implementation helper skills, mark fallback and create issue-level implementation design, exact TDD or characterization plan, RED/GREEN/REFACTOR evidence, and non-browser runtime evidence when no browser surface exists.
- When `spec-workflow` reveals a wrong route, missing setup gate, skipped TDD evidence, repeated QA/docs omission, or tool/security gate miss, leave an `agent-eval-harness` seed candidate instead of running an unbounded improvement loop.
- When either workflow touches tools, MCP, external APIs, write-capable automation, network access, or untrusted content, record the Agent Tool And Security Risk Gate before implementation.
- In this repo, `/goal` references mean Claude Code's `/goal` feature. When `project-workflow` or `spec-workflow` runs long tasks on Claude Code, propose a goal condition with measurable end state, check evidence, constraints, and turn/time bound; on other runtimes, write the same content as a completion checklist.
- When workflow routing needs repeatable behavior checks, call `agent-eval-harness` as a separate validation layer and seed cases for `project-workflow` routing, `spec-workflow` routing, dependency inventory, `project-structure` timing, PRD settings, UI mockup selection, CLI/no-browser evidence, MCP/API gate decisions, fallback lane, project setup verification, completion mapping, document sync, artifact hygiene, and goal condition quality.
- When using `sync-docs`, treat current repo files as the first evidence source, refresh folder-local `AGENTS.md` indexes when folder trees change, verify target project skill setup when instruction links/snippets change, and ask before changing a documentation rule when the source of truth is unclear.
- When using `transcript-polisher`, treat scripts as discovery or validation helpers only, never as the prose editing engine; split text by coherent sections, preserve source/output relative paths in parallel output mode, keep `polish` outputs from collapsing into summaries, delegate one section per subagent only when the user requested it or the active runtime policy permits automatic delegation, preserve lecture examples and generated awkward-output examples, and report Claude Code `/goal`-style completion evidence for long reviews.
- When using `terminal-session-automation`, detect the host first: prefer local cmux CLI output and `cmux docs ...` for cmux, `TERM_PROGRAM=WarpTerminal` plus `/dev/tty` title output for Warp, and safe shell title/workflow notes for generic terminals. Keep hook changes project-local unless global setup is explicitly requested, and ask before installing hooks, editing socket auth, sending text to panes, closing surfaces, or clearing history; also ask before changing global Warp, Oz, shell, or terminal profile settings.
- When using `agent-improvement-loop`, choose the skills-repo track for skill catalogs and the general-repo track for application or library repos; before any spend-down run, ask `남은 토큰을 최대한 사용해서 안전한 backlog를 처리할까요? (예/아니오)`; if the answer is yes, run safe backlog items in small multi-agent batches; if no, treat token budget as a ceiling and review one lane at a time; prefer durable artifacts such as docs, validators, tests, hooks, snippets, or eval cases over chat-only advice; use Claude Code `/goal` only when bounded by measurable end state, check evidence, constraints, and turn/time/item limit.
- When using `agent-eval-harness`, start with a small repo-local deterministic harness under `evals/agent/`, define success criteria before cases, record `agentSurfaces` and `assumptionDate` for fast-changing agent behavior, prefer deterministic checks such as `required_link_count`, `required_file_reference`, and `json_schema`, include the minimum safety case pack and artifact scrub policy, make live model/API evals advisory until budget and flake policy are explicit, convert real agent failures into minimal regression cases, and test `/goal`-style condition quality with deterministic text checks when relevant.
- When using `browser-qa`, keep the review grounded in observed browser evidence, do not enter secrets, payment data, or destructive live actions, and close Playwright/Chrome tabs plus any local HTTP/dev server started for QA unless the user explicitly needs it kept running.
- When using `code-review`, lead with findings and file/line references; for JS/TS prefer clear functional collection style where it improves clarity, without forcing it over simpler loops; include agent/tool-call boundaries, prompt injection, destructive side effects, least privilege, approval, and secret/private-data scrubbing when the diff touches those surfaces.
- When using `design-review`, respect the target project's existing design system and product domain first; use quiet operational UI, restrained color, shallow borders, stable dimensions, 8px-or-less radius, no decorative orbs/gradients/bokeh, and no nested cards only as the shared fallback profile.
- When using `skill-creator`, run `skill-to-html` immediately afterward for the same skill folder.

## Structure

- Skill folders live under `skills/`, for example `skills/web-research/`.
- Each skill folder must include `SKILL.md` for agent instructions and `skill.html` for human install-time reading.
- Project-ready snippets live in `project-snippets/`.
- Workflow docs live in `docs/`.
- Lifecycle criteria live in `docs/skill-lifecycle.md`; durable lifecycle events live in `history/skills.md`.
- Skill inspector criteria live in `docs/skill-inspector.md`; local inspector scratch files live in ignored `inspector/`.
- Archived skills, if any, live in `archive/`.
- Personal taste and deeper guidance should live inside each skill's `references/` folder.

## Editing Skills

- Use the system `skill-creator` for skill scaffolding guidance when helpful.
- Write repo-owned Markdown skill documents in Korean by default. This applies to `skills/**/*.md`, including `SKILL.md` and `references/*.md`; keep code identifiers, command names, file paths, product names, protocol names, and quoted upstream skill names in their original spelling when translation would reduce precision.
- Keep `SKILL.md` concise and trigger-focused.
- Put long preferences, source rules, examples, and project-specific variants in references or snippets.
- Use `skills/skill-to-html/SKILL.md` when creating or revising a skill's `skill.html`.
- Update that skill's `skill.html` when adding, removing, renaming, or materially changing a skill.
- Make `skill.html` diagram-rich: include decision matrices, flowcharts, charts, resource maps, or input/output schemas instead of only splitting text into panels.
- Validate changed skills with `node scripts/validate-skill.ts <skill-path>`, any skill-specific validator, `node scripts/validate-korean-markdown.ts .`, `node scripts/validate-skill-html.ts .`, and `node scripts/run-agent-evals.ts` before calling them done.
- Use TypeScript for repo-owned validators and run them with Node 22+ as `node <file>.ts`; do not add Python validators to this repo. Keep `.mjs` only when a hook or external runtime specifically needs it.
- Run `node scripts/validate-skill-repo.ts .` after lifecycle, history, snippet, or repo-level documentation changes.
- Update `history/skills.md` when adding, deprecating, archiving, renaming, splitting, merging, or materially changing a skill's trigger, workflow, validators, evals, or snippets.
- Review `docs/skill-inspector.md` before calling a created or materially changed skill done. After an inspection, write the review result to ignored `inspector/YYYY-MM-DD-<scope>.md` before fixing it. Leave only unresolved local review notes in `inspector/`, and delete resolved review files.

## Project Setup

When asked to set up skills for a project:

1. Read this repo's `README.md`.
2. Select only the skills relevant to that project.
3. Add links to those skills in the target project's agent instruction file, such as `AGENTS.md` or `CLAUDE.md`.
4. Add project-specific overrides in the target project, not in the shared skill, unless the preference should apply everywhere.
