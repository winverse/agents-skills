# Project Skill Setup

Use this workflow when configuring a project to use skills from `/Users/winverse/Desktop/skills`.

## Goal

Each project should explicitly choose the skills it uses. The skills repo stays as the shared catalog and source of truth for Codex, Claude, and other agents.

This repo does not vendor Codex system skills. For new skill creation, use the installed system `skill-creator` at:

```text
/Users/winverse/.codex/skills/.system/skill-creator/SKILL.md
```

Then apply this repo's `skill-to-html` to create the human-facing `skill.html`.

## Setup Steps

1. Open the target project's agent instruction file, usually `AGENTS.md` for Codex or `CLAUDE.md` for Claude.
2. Open each candidate skill's `skill.html` to understand the skill visually before linking it.
3. Add a `Project Skills` section if it does not exist.
4. Add links to the selected skill `SKILL.md` files from this repo.
5. Add project-specific overrides directly below the selected skill list.
6. Keep the linked skill as the shared default. Fork only when one project needs a permanently different version.

## Recommended Block

```markdown
## Project Skills

- Use [$web-research](/Users/winverse/Desktop/skills/web-research/SKILL.md) when a task needs current facts, web verification, source comparison, citations, recommendations, product research, laws, regulations, or technical documentation lookup.

## Project Skill Overrides

- Prefer this project's local docs, source code, and version logs before general web research.
- Use external sources only when local project context is incomplete or current facts are required.
```

## Forking Rule

Fork a skill only when the project needs behavior that should not affect other projects.

Recommended fork path:

```text
<project-root>/skills/<skill-name>/SKILL.md
```

If a project forks a skill, link the project-local skill in the target agent instruction file and mention which repo skill it was forked from.

The fork should keep the same pair:

```text
<project-root>/skills/<skill-name>/SKILL.md
<project-root>/skills/<skill-name>/skill.html
```

## Update Rule

When a shared skill changes:

- Update `README.md` if the skill's purpose changed.
- Use `skill-to-html` to update the skill's own `skill.html`.
- Update the matching file in `project-snippets/`.
- Revisit project instruction files only when the trigger or path changed.
