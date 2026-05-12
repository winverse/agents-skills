## Project Skills

- For current facts, web verification, source comparison, citations, recommendations, product research, laws, regulations, technical documentation lookup, or structured search beyond simple keywords, use the shared skill at `<skills-root>/skills/web-research/SKILL.md`.
- When creating, installing, forking, or updating a shared skill, use the shared guide at `<skills-root>/skills/skill-to-html/SKILL.md` so the skill folder gets a diagram-rich `skill.html` beside `SKILL.md`.
- For coding, reviewing, refactoring, debugging, or implementation planning that should follow Karpathy-style agent discipline, use the shared skill at `<skills-root>/skills/karpathy-thinkings/SKILL.md`.
- For updating, revising, maintaining, renaming, splitting, deprecating, or otherwise changing an existing shared skill, use the shared skill at `<skills-root>/skills/skill-update/SKILL.md`.
- For commit requests, split dirty files into logical changesets and use the shared skill at `<skills-root>/skills/atomic-committer/SKILL.md`.
- For choosing, creating, standardizing, or refactoring frontend, backend, full-stack monorepo, or desktop app folder structures, use the shared skill at `<skills-root>/skills/project-structure/SKILL.md`.
- For documentation refresh, stale-doc review, or conflicting repo instructions, use the shared skill at `<skills-root>/skills/sync-docs/SKILL.md`.

## Project Skill Overrides

- Prefer this project's local docs, source code, and logs before general web results.
- Use repo-linked custom skills before default/global Claude behavior when the behavior overlaps.
- For implementation work, avoid silent assumptions, prefer simple code, make surgical changes, and verify success criteria before calling work done.
- For skill updates, keep source instructions, references, validators, visual guides, snippets, docs, and history aligned.
- For project structure work, include the selected project's test, security, health/readiness, observability, Panda CSS, GraphQL generated artifact, and Drizzle migration boundaries in the final tree.
- Commit messages should use an English conventional prefix with a Korean summary, and push only when a remote exists and push was requested.
- For project structure choices, default to Bun, Turborepo, Next.js, NestJS with Fastify, GraphQL, urql, GraphQL Code Generator, PostgreSQL, Drizzle, Panda CSS with headless UI, Tauri, and Zod env validation unless the project says otherwise.
- For project structure choices, keep app env/codegen paths consistent and place monorepo Redis boundaries in `packages/db/src/redis`, with API cache wrappers under `apps/api/src/providers/cache`.
- For documentation sync, compare current repo files first and ask before changing unclear rules.
- If Claude cannot automatically load a linked `SKILL.md`, read or paste the relevant section from that skill into the current task context.
- Keep project-specific rules here instead of changing the shared skill unless the rule should apply everywhere.
