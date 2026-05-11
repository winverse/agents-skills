## Project Skills

- For current facts, web verification, source comparison, citations, recommendations, product research, laws, regulations, technical documentation lookup, or structured search beyond simple keywords, use the shared skill at `<skills-root>/skills/web-research/SKILL.md`.
- When creating, installing, forking, or updating a shared skill, use the shared skill at `<skills-root>/skills/skill-to-html/SKILL.md` so the skill folder gets a diagram-rich `skill.html` beside `SKILL.md`.
- For updating, revising, maintaining, renaming, splitting, deprecating, or otherwise changing an existing shared skill, use the shared skill at `<skills-root>/skills/skill-update/SKILL.md`.
- For commit requests, split dirty files into logical changesets and use the shared skill at `<skills-root>/skills/atomic-committer/SKILL.md`.
- For choosing, creating, standardizing, or refactoring frontend, backend, full-stack monorepo, or desktop app folder structures, use the shared skill at `<skills-root>/skills/project-structure/SKILL.md`.
- For documentation refresh, stale-doc review, or conflicting repo instructions, use the shared skill at `<skills-root>/skills/sync-docs/SKILL.md`.

## Project Skill Overrides

- Prefer this project's local docs, source code, and logs before general web results.
- Use repo-linked custom skills before default/global agent behavior when the behavior overlaps.
- When using `web-research` for broad or high-stakes topics, use the smallest safe research budget, then query fan-out, source ledgers, evidence scoring, counterexample search, and stop rules.
- When using `skill-update`, keep `SKILL.md`, references, validators, `agents/openai.yaml`, `skill.html`, snippets, docs, and history aligned when behavior changes.
- When using `atomic-committer`, group dirty files by logical changeset, write commit messages with an English conventional prefix and Korean summary, and push only when a remote exists and push was requested.
- When using `project-structure`, default to Bun, Turborepo, Next.js, NestJS with Fastify, GraphQL, urql, GraphQL Code Generator, PostgreSQL, Drizzle, Panda CSS with headless UI, Tauri, and Zod env validation unless the project says otherwise.
- When using `sync-docs`, treat current repo files as the first evidence source and ask before changing a documentation rule when the source of truth is unclear.
- Add more project-specific rules here instead of changing the shared skill unless the rule should apply everywhere.
