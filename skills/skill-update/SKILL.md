---
name: skill-update
description: Use when the user asks to update, revise, improve, maintain, rename, split, deprecate, or otherwise change an existing shared skill. This skill coordinates SKILL.md, references, validators, agents metadata, project snippets, skill.html, history, inspector review, and documentation sync so the skill remains usable across Codex, Claude, and other agents.
---

# Skill Update

Use this skill for existing skill maintenance. It is the orchestration layer for changing a shared skill without leaving stale guides, snippets, validators, or lifecycle records behind.

For brand-new skill scaffolding, use the system `skill-creator` first. After the initial skill exists, use this skill to bring the whole skill package to done.

Load `references/update-checklist.md` when the update touches trigger wording, workflow, validators, snippets, lifecycle state, more than one file, or when the impact is not obvious.

## Core Contract

- Start from the user's intended behavior change, not from cosmetic edits.
- Preserve existing useful behavior unless the user asked to remove it.
- Keep `SKILL.md` concise; move deeper examples, preferences, and edge cases into `references/`.
- Update the whole skill package when behavior changes: `SKILL.md`, references, validator, `agents/openai.yaml`, `skill.html`, project snippets, repo docs, and history as needed.
- Use `skill-to-html` after material skill changes so the adjacent `skill.html` stays current.
- Use `sync-docs` when README, AGENTS, docs, snippets, history, or paths may drift.
- Ask the user before deciding unclear behavior, source-of-truth conflicts, deprecation, rename, split, or removal.
- Run relevant validators before calling the update done.

## Update Scope

Classify the change before editing:

| Change type | Required follow-up |
| --- | --- |
| Trigger or description | Update `SKILL.md`, snippets, README, AGENTS, `agents/openai.yaml`, `skill.html`, history |
| Workflow or rules | Update `SKILL.md`, references, validator, `skill.html`, history |
| Reference detail | Update reference file, validator if it checks the detail, `skill.html` if the visible behavior changes |
| Validator or script | Keep TypeScript for repo-owned validators, update README command, run it, record history when material |
| Rename, split, merge, deprecate | Ask if unclear, update paths everywhere, update history lifecycle, run `sync-docs` |
| Visual guide only | Use `skill-to-html` standards, run skill validator, skip history unless behavior changed |

## Workflow

1. Identify the target skill and the requested outcome.
2. Inspect the current skill folder, `project-snippets/`, README, AGENTS, and `history/skills.md`.
3. Read the target `SKILL.md` and only the references needed for the requested change.
4. Decide the update scope using the table above.
5. Ask a focused question if the intended behavior or source of truth is ambiguous.
6. Edit the minimal set of files needed for a complete package update.
7. Run `skill-to-html` for material skill changes or any visible trigger/workflow change.
8. Run `sync-docs` when cross-document wording, paths, snippets, history, or validator commands may be stale.
9. Review `docs/skill-inspector.md`; if inspection finds issues, write a local `inspector/YYYY-MM-DD-<scope>.md`, fix from that record, and delete the record once resolved.
10. Run validation:
    - `node scripts/validate-skill.ts skills/<skill-name>`
    - the target skill's custom validator when one exists
    - `node scripts/validate-skill-repo.ts .`
11. Report changed files, behavior changes, validation, and unresolved questions.

## Ask Before Changing

Ask the user before:

- changing when a skill should trigger,
- removing behavior that may still be used by projects,
- renaming, splitting, merging, deprecating, or archiving a skill,
- changing a repo-wide preference,
- resolving a conflict where local files do not reveal the intended rule.

## Output Shape

Keep the final report compact:

```text
Updated
- <skill>: <behavior/package change>

Validation
- <command>: <pass/fail>

Open Questions
- <only if unresolved>
```

If no files needed changes, say what was reviewed and why the skill was left as-is.
