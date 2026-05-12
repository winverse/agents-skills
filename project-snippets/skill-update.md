## Project Skills

- Use $skill-update at <skills-root>/skills/skill-update/SKILL.md when asked to update, revise, improve, maintain, rename, split, deprecate, or otherwise change an existing shared skill.

## Project-Specific Overrides

- Keep `SKILL.md`, references, validator, `agents/openai.yaml`, `skill.html`, snippets, docs, and history aligned when behavior changes.
- Use `skill-to-html` after material skill changes.
- Run `node skills/show-skills/scripts/update-html-catalog.ts skills/show-skills` after skill add, remove, rename, archive, or restore operations.
- Use `sync-docs` when paths, snippets, README, AGENTS, docs, history, or validation commands may drift.
- Ask before changing unclear trigger behavior, lifecycle state, rename, split, merge, deprecation, or removal.
