# Project Skill Setup

Use this workflow when configuring a project to use skills from this repo. In copied snippets, replace `<skills-root>` with the actual path where this repo is cloned.

## Goal

Each project should explicitly choose the skills it uses. The skills repo stays as the shared catalog and source of truth for Codex, Claude, and other agents.

This document is only for connecting existing shared skills to a target project. For creating or materially changing a shared skill, use README's `생성과 검증` section and `docs/skill-inspector.md`.

## Setup Steps

1. Open the target project's agent instruction file, usually `AGENTS.md` for Codex or `CLAUDE.md` for Claude.
2. Open each candidate skill's `skill.html` to understand the skill visually before linking it.
3. Add a `Project Skills` section if it does not exist.
4. Add links to the selected skill `SKILL.md` files from this repo.
5. Add project-specific overrides directly below the selected skill list.
6. Keep the linked skill as the shared default. Fork only when one project needs a permanently different version.
7. Check `history/skills.md` if the skill is unfamiliar, deprecated, or recently changed.

## Snippet Sources

Use the smallest snippet that matches the target project and agent:

- `project-snippets/base.md`: agent-neutral starter block for the current shared skills.
- `project-snippets/claude-base.md`: Claude-oriented starter block.
- `project-snippets/show-skills.md`: only current skill catalog browsing and skill recommendation.
- `project-snippets/web-research.md`: only the web research skill.
- `project-snippets/skill-to-html.md`: only the skill HTML guide workflow.
- `project-snippets/karpathy-thinkings.md`: only Karpathy-style coding agent discipline.
- `project-snippets/skill-update.md`: only existing skill maintenance and package sync rules.
- `project-snippets/agent-improvement-loop.md`: only repo quality improvement loops and spend-down consent routing.
- `project-snippets/browser-qa.md`: only browser runtime evidence and Playwright QA.
- `project-snippets/code-review.md`: only findings-first code review.
- `project-snippets/design-review.md`: only product-aware UI and design review.
- `project-snippets/atomic-committer.md`: only commit grouping and push rules.
- `project-snippets/project-structure.md`: only project structure and default stack rules.
- `project-snippets/sync-docs.md`: only documentation refresh and conflict reconciliation rules.
- `project-snippets/cmux-automation.md`: only cmux automation, prompt pinning, tab/status automation, workspace boards, feed workflows, and cmux CLI ergonomics.

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
- Update `AGENTS.md`, `docs/skill-catalog.md`, `project-snippets/base.md`, and `project-snippets/claude-base.md` when the trigger, path, or project-facing behavior changed.
- Use `skill-to-html` to update the skill's own `skill.html`.
- Update the matching file in `project-snippets/`.
- Update `history/skills.md` if trigger, workflow, validator, eval prompt, snippet, inspector criteria, or lifecycle state changed.
- Keep repo-owned validators in `.ts` and run them with Node 22+.
- Run `node scripts/validate-skill-html.ts .` and `node scripts/validate-skill-repo.ts .` after shared skill or repo-level docs changes.
- Revisit project instruction files only when the trigger or path changed.
