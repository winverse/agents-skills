## Project Skills

- For seeing, listing, browsing, summarizing, choosing, comparing, or discovering the current skills in this repository, use the shared skill at `<skills-root>/skills/show-skills/SKILL.md`.
- For current facts, web verification, source comparison, citations, recommendations, product research, laws, regulations, technical documentation lookup, or structured search beyond simple keywords, use the shared skill at `<skills-root>/skills/web-research/SKILL.md`.
- When creating, installing, forking, or updating a shared skill, use the shared skill at `<skills-root>/skills/skill-to-html/SKILL.md` so the skill folder gets a diagram-rich `skill.html` beside `SKILL.md`.
- For coding, reviewing, refactoring, debugging, or implementation planning that should follow Karpathy-style agent discipline, use the shared skill at `<skills-root>/skills/karpathy-thinkings/SKILL.md`.
- For updating, revising, maintaining, renaming, splitting, deprecating, or otherwise changing an existing shared skill, use the shared skill at `<skills-root>/skills/skill-update/SKILL.md`.
- For commit requests, split dirty files into logical changesets and use the shared skill at `<skills-root>/skills/atomic-committer/SKILL.md`.
- For choosing, creating, standardizing, or refactoring frontend, backend, full-stack monorepo, or desktop app folder structures, use the shared skill at `<skills-root>/skills/project-structure/SKILL.md`.
- For documentation refresh, stale-doc review, or conflicting repo instructions, use the shared skill at `<skills-root>/skills/sync-docs/SKILL.md`.
- For cmux hooks, Codex prompt pinning, tab/status automation, workspace boards, feed workflows, or cmux CLI-driven session ergonomics, use the shared skill at `<skills-root>/skills/cmux-automation/SKILL.md`.
- For using spare token or context budget productively, improving agent skill usage, making skills easier to invoke, adding or reviewing validators, aligning documentation, creating self-improvement loops, or raising repo quality through tests, hooks, docs, evals, and review automation, use the shared skill at `<skills-root>/skills/agent-improvement-loop/SKILL.md`.
- For browser runtime verification, Playwright checks, screenshots, console or network inspection, accessibility snapshots, broken links, responsive layout checks, text overlap detection, or `skill.html` rendering QA, use the shared skill at `<skills-root>/skills/browser-qa/SKILL.md`.
- For code review, PR review, diff review, implementation audit, regression risk review, missing test review, maintainability review, or JavaScript and TypeScript style review, use the shared skill at `<skills-root>/skills/code-review/SKILL.md`.
- For design review, UI review, visual critique, layout critique, interaction critique, design-system fit, accessibility review, responsive design review, visual hierarchy review, product surface polish, or product-aware design judgment, use the shared skill at `<skills-root>/skills/design-review/SKILL.md`.

## Project Skill Overrides

- Prefer this project's local docs, source code, and logs before general web results.
- Use repo-linked custom skills before default/global agent behavior when the behavior overlaps.
- When using `show-skills`, prefer the live listing script and `docs/skill-catalog.md`; do not install or globally register skills while listing them.
- When using `web-research` for verified, broad, or high-stakes topics, use the smallest safe research budget, then query fan-out, source ledgers, evidence scoring, counterexample search, and stop rules.
- For verified or deeper web research, default to parallel sub-agent fan-out when the runtime permits delegation. Fall back to main-agent query fan-out for quick checks, private data, or runtime/tool policy limits.
- When using `karpathy-thinkings`, think before coding, avoid silent assumptions, prefer simple implementations, make surgical changes, and verify success criteria.
- When using `skill-update`, keep `SKILL.md`, references, validators, `agents/openai.yaml`, `skill.html`, snippets, docs, and history aligned when behavior changes.
- When using `atomic-committer`, scan candidate commits for forbidden secret-bearing content, hard-block live-looking credential assignments and private-key material across common providers, group dirty files by logical changeset, write commit messages with an English conventional prefix and Korean summary, and push only when a remote exists and push was requested.
- When using `project-structure`, default to Bun, Turborepo, Next.js, NestJS with Fastify, GraphQL, urql, GraphQL Code Generator, PostgreSQL, Drizzle, Panda CSS with headless UI, Tauri, and Zod env validation unless the project says otherwise.
- When using `project-structure`, keep app env/codegen paths consistent and place monorepo Redis boundaries in `packages/db/src/redis`, with API cache wrappers under `apps/api/src/providers/cache`.
- When using `project-structure`, include the selected project's test, security, health/readiness, observability, Panda CSS, GraphQL generated artifact, and Drizzle migration boundaries in the final tree.
- When using `sync-docs`, treat current repo files as the first evidence source and ask before changing a documentation rule when the source of truth is unclear.
- When using `cmux-automation`, prefer local cmux CLI output and keep hook/config changes project-local unless global setup is explicitly requested.
- When using `agent-improvement-loop`, choose the skills-repo track for skill catalogs and the general-repo track for application or library repos; before any spend-down run, ask `남은 토큰을 최대한 사용해서 안전한 backlog를 처리할까요? (예/아니오)`; if the answer is yes, run safe backlog items in small multi-agent batches; if no, treat token budget as a ceiling and review one lane at a time; prefer durable artifacts such as docs, validators, tests, hooks, snippets, or eval cases over chat-only advice.
- When using `browser-qa`, report URL, viewport, evidence, reproduction step, and severity; keep subjective design critique in `design-review`.
- When using `code-review`, lead with findings and file/line references; for JS/TS prefer clear functional collection style where it improves clarity, without forcing it over simpler loops.
- When using `design-review`, respect the target project's existing design system and product domain first; use quiet operational UI, restrained color, shallow borders, stable dimensions, 8px-or-less radius, no decorative orbs/gradients/bokeh, and no nested cards only as the shared fallback profile.
- Add more project-specific rules here instead of changing the shared skill unless the rule should apply everywhere.
