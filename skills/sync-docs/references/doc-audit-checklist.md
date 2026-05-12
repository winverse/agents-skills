# Documentation Audit Checklist

Use this reference when `sync-docs` needs a systematic pass across multiple docs.

## Inventory

Start with the smallest inventory that covers the task:

```bash
git status --short
find . -maxdepth 3 -type f | sort
rg -n "old-name|deprecated|TODO|FIXME|validator|hook|snippet|history|lifecycle|AGENTS.md|CLAUDE.md" README.md AGENTS.md docs history project-snippets skills scripts .codex
```

Do not include ignored local scratch folders in the final documentation unless the repo's rules say to do so.

## Claim Ledger

For each claim that matters, track:

| Field | Meaning |
| --- | --- |
| Claim | A rule, path, command, workflow step, status, or named skill |
| Stated in | Files that contain the claim |
| Evidence | Code, validator, current file tree, history row, or user request |
| Confidence | High, medium, or low |
| Action | Update, leave, ask user, or record follow-up |

## Common Conflict Types

- **Name drift**: a renamed skill, script, folder, or command remains in older docs.
- **Path drift**: docs reference files that no longer exist or omit files that now exist.
- **Command drift**: validation or setup commands changed but docs still show the old invocation.
- **Scope drift**: a shared skill accidentally describes project-specific behavior.
- **Agent drift**: docs assume Codex-only behavior even though the repo targets Claude or other agents too.
- **Lifecycle drift**: `history/skills.md` says a skill is active, deprecated, or critical but docs imply another state.
- **Snippet drift**: reusable snippets omit a current skill or include a removed one.
- **Project setup drift**: a target `AGENTS.md`, `CLAUDE.md`, or copied snippet references stale skill paths, missing `skill.html` companions, placeholder `<skills-root>` values, or global install instructions that the user did not request.
- **Hook drift**: hook docs no longer match `.codex/config.toml` or `.codex/hooks/*`.
- **Folder AGENTS drift**: folder-local `AGENTS.md` indexes no longer match the current folder tree, local map, validation commands, or root instruction precedence.

## Fix Strategy

Prefer small, traceable edits:

1. Update the stale statement where it appears.
2. Add missing cross-references only where users would actually look.
3. Avoid duplicating long rules in many docs; link to the source document.
4. Keep examples short and current.
5. Do not rewrite history rows unless they are factually wrong; add a new event for new durable changes.
6. When a folder tree changes, refresh the nearest folder-local `AGENTS.md` table of contents in the same change.
7. When syncing target project skill setup, compare the target instruction file against `docs/project-skill-setup.md`, the selected snippets, and the actual `skills/*/SKILL.md` plus `skill.html` files before declaring setup complete.
8. If a doc should intentionally stay incomplete, say why in the final report rather than padding it.

## Validation Pass

Run available validators after edits:

```bash
node scripts/validate-skill.ts
node scripts/validate-skill-repo.ts .
```

For changed skills, also run their custom validators:

```bash
node skills/<skill-name>/scripts/validate-<skill-name>.ts skills/<skill-name>
```

If the repo has hook or doc-specific checks, run those too.
