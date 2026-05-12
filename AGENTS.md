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

- Use $web-research at `skills/web-research/SKILL.md` when a task needs current facts, web verification, source comparison, citations, recommendations, product research, laws, regulations, technical documentation lookup, or structured search beyond simple keywords.
- Use $skill-to-html at `skills/skill-to-html/SKILL.md` whenever a skill is created, installed, forked, or updated, so the skill folder gets a diagram-rich `skill.html` beside `SKILL.md`.
- Use $karpathy-thinkings at `skills/karpathy-thinkings/SKILL.md` when coding, reviewing, refactoring, debugging, or planning implementation work that should follow Karpathy-style agent discipline.
- Use $skill-update at `skills/skill-update/SKILL.md` when asked to update, revise, improve, maintain, rename, split, deprecate, or otherwise change an existing shared skill.
- Use $atomic-committer at `skills/atomic-committer/SKILL.md` when asked to commit, split changes into commits, create multiple logical commits, or commit and push.
- Use $project-structure at `skills/project-structure/SKILL.md` when asked to choose, create, standardize, or refactor frontend, backend, full-stack monorepo, or desktop app folder structures.
- Use $sync-docs at `skills/sync-docs/SKILL.md` when asked to review, refresh, reconcile, or update documentation by comparing existing docs, snippets, history, skills, and repo instruction files.

## Project Skill Overrides

- Use repo-linked custom skills before default/global agent behavior when the behavior overlaps.
- When using `karpathy-thinkings`, think before coding, avoid silent assumptions, prefer simple implementations, make surgical changes, and verify success criteria.
- When using `atomic-committer`, group dirty files by logical changeset, write commit messages with an English conventional prefix and Korean summary, and push only when a remote exists and push was requested.
- When using `skill-update`, keep `SKILL.md`, references, validators, `agents/openai.yaml`, `skill.html`, snippets, docs, and history aligned when behavior changes.
- When using `project-structure`, default to Bun, Turborepo, Next.js, NestJS with Fastify, GraphQL, urql, GraphQL Code Generator, PostgreSQL, Drizzle, Panda CSS with headless UI, Tauri, and Zod env validation unless the project says otherwise.
- When using `sync-docs`, treat current repo files as the first evidence source and ask before changing a documentation rule when the source of truth is unclear.
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
- Keep `SKILL.md` concise and trigger-focused.
- Put long preferences, source rules, examples, and project-specific variants in references or snippets.
- Use `skills/skill-to-html/SKILL.md` when creating or revising a skill's `skill.html`.
- Update that skill's `skill.html` when adding, removing, renaming, or materially changing a skill.
- Make `skill.html` diagram-rich: include decision matrices, flowcharts, charts, resource maps, or input/output schemas instead of only splitting text into panels.
- Validate changed skills with `node scripts/validate-skill.ts <skill-path>` and any skill-specific validator before calling them done.
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
