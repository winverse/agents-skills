# Skill Update Checklist

Use this checklist for material updates to an existing shared skill.

## Inventory

Start with current state:

```bash
git status --short
find skills/<skill-name> -maxdepth 3 -type f | sort
rg -n "<skill-name>|old-name|trigger|validator|snippet|history" README.md AGENTS.md docs history project-snippets skills/<skill-name>
```

Read only the target files needed for the requested update.

## Package Completeness Matrix

| Area | Check |
| --- | --- |
| `SKILL.md` | Frontmatter name/description are current; trigger is clear; workflow is concise |
| `references/` | Long details and examples live here, not in `SKILL.md` |
| `agents/openai.yaml` | Display name, short description, and default prompt match current behavior |
| `scripts/validate-*.ts` | Repo-owned validator is TypeScript and checks the behavior that matters |
| `skill.html` | Visual guide reflects current trigger, workflow, resources, and project connection |
| `project-snippets/` | Paths and trigger wording match `SKILL.md` |
| `README.md` | Current skill catalog entry and validator command are present |
| `AGENTS.md` | Repo-local skill link and overrides are present if relevant |
| `history/skills.md` | Durable lifecycle and material behavior changes are recorded |
| `show-skills/skill.html` | Skill inventory changes are reflected by `update-html-catalog.ts` |
| `docs/` | Shared workflow docs do not contradict the updated skill |

## Coordination Rules

- Use `skill-to-html` for any material change that affects how a human chooses or uses the skill.
- Run `node skills/show-skills/scripts/update-html-catalog.ts skills/show-skills` after skill add, remove, rename, archive, or restore operations.
- Use `sync-docs` when the update changes names, paths, snippets, validation commands, history, lifecycle, or repo-level wording.
- Use `atomic-committer` only when the user asks to commit or push the completed update.
- Use web research only if the update depends on external current facts.

## History Rules

Record in `history/skills.md` when the update changes:

- trigger,
- workflow,
- validator,
- eval prompt,
- project snippet,
- lifecycle state,
- skill name or folder,
- split, merge, deprecation, or archive status.
- generated `show-skills/skill.html` catalog behavior.

Do not record purely cosmetic HTML spacing, typo-only edits, or repeated validator results.

## Validation

Run the target skill and repo validators:

```bash
node scripts/validate-skill.ts skills/<skill-name>
node skills/<skill-name>/scripts/validate-<skill-name>.ts skills/<skill-name>
node skills/show-skills/scripts/update-html-catalog.ts skills/show-skills --check
node scripts/validate-skill-repo.ts .
```

If the update touched hooks or generated HTML, run the hook dry-run or HTML static checks that the repo uses.

## Failure Modes

- Updating `SKILL.md` but leaving `skill.html` stale.
- Adding, removing, or renaming a skill without regenerating the `show-skills` HTML catalog.
- Updating README but forgetting `project-snippets/`.
- Changing a validator command without documenting it.
- Turning history into a scratchpad instead of a durable ledger.
- Resolving ambiguous behavior without asking the user.
- Adding Python validators in this repo instead of TypeScript.
