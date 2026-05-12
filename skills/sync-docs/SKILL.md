---
name: sync-docs
description: Use when the user asks to review, refresh, reconcile, or update documentation by comparing existing documents, snippets, skill files, history, target project skill setup, and repo instructions. This skill finds stale statements, missing cross-references, contradictory guidance, and unclear source-of-truth conflicts, updates what is certain, and asks the user when the intended rule is ambiguous.
---

# Sync Docs

Use this skill when the task is about keeping documentation consistent across a repo: README files, root or folder-local agent instructions, snippets, workflow docs, history ledgers, skill guides, or other local docs.

Load `references/doc-audit-checklist.md` when the repo has more than a few docs, when several docs disagree, or when you need a repeatable review checklist.

## Core Contract

- Compare existing documents against each other before rewriting.
- Treat the repo's current files as the primary evidence. Browse the web only if the user asks for external or current facts.
- Identify the source of truth for each claim before changing it.
- Update clear stale or missing references directly.
- Ask the user when two docs conflict and the intended rule cannot be inferred from local evidence.
- Keep edits scoped to documentation and directly related validation or snippet files.
- Preserve durable history and local-only review rules used by the repo.

## What To Check

- Skill lists and paths in README, agent instruction files, snippets, and history.
- Folder-local `AGENTS.md` indexes that describe boundary folders, local maps, editable areas, do-not-touch areas, related skills, and validation commands.
- Target project skill setup: selected `SKILL.md` links, neighboring `skill.html` files, copied snippets, project-specific overrides, and no global install instructions unless explicitly requested.
- Workflow steps that disagree across docs.
- Deprecated names, old file paths, renamed skills, or removed scripts.
- Validator commands, runtime requirements, and hook behavior.
- Lifecycle state, review dates, and history events.
- Human-facing guides such as `skill.html` when doc wording or triggers changed.
- Local-only review notes that should not be committed.

## Workflow

1. Inspect the current tree with `git status --short`, `find` or `rg --files`, and targeted `rg` searches for old names, paths, and repeated rules.
2. Build a documentation inventory:
   - canonical docs such as `README.md`, `AGENTS.md`, `docs/`, and `history/`;
   - folder-local instruction indexes such as `apps/*/AGENTS.md`, `packages/*/AGENTS.md`, and `infra/*/AGENTS.md`;
   - reusable snippets such as `project-snippets/`;
   - skill files such as `skills/*/SKILL.md`, `skill.html`, validators, and references.
3. For each important claim, create a small mental ledger:
   - claim,
   - files that state it,
   - likely source of truth,
   - confidence,
   - action: update, leave, or ask.
4. Fix high-confidence mismatches:
   - stale names and paths,
   - missing entries for current skills or docs,
   - validator commands that no longer exist,
   - snippets that omit required current rules,
   - target project instruction files whose selected skill links or snippets drift from `docs/project-skill-setup.md`,
   - folder-local `AGENTS.md` indexes whose table of contents no longer matches the folder tree,
   - docs that describe behavior the repo no longer implements.
5. If confidence is low, ask the user a focused question before changing the rule.
6. Run the repo's documentation and skill validators when available.
7. Report what was synchronized, what was intentionally left alone, what remains uncertain, and which validations ran.

## Source Of Truth Heuristics

- Active code, scripts, hooks, and validators beat old prose.
- `README.md` is the public catalog, but repo-local operational rules may live in `AGENTS.md`.
- `history/skills.md` records durable lifecycle events; it should not be rewritten as a scratchpad.
- `docs/skill-lifecycle.md` defines lifecycle meanings, while `history/skills.md` records actual states.
- `project-snippets/` should mirror current skill triggers and paths but should stay small.
- For a single skill, `SKILL.md` defines agent behavior and `skill.html` visualizes it for humans.
- For folder-local instruction indexes, the current folder tree and root `AGENTS.md` define the broad rule; local files should only narrow or map that folder's responsibilities.

## Ask The User When

- Two current docs express different preferences and neither is clearly older.
- Updating a rule would change how agents behave, not just how docs describe behavior.
- A folder-local `AGENTS.md` appears to override root rules and the intended precedence is unclear.
- A historical event looks inaccurate but may be intentionally preserved.
- A doc names a future plan or personal preference that cannot be verified from the repo.
- The requested sync would remove context that may still matter to another project.

## Output Shape

Use a compact report:

```text
Synchronized
- <file>: <what changed>

Questions
- <specific unresolved rule or source-of-truth conflict>

Validation
- <command>: <pass/fail>
```

Do not produce a long audit essay unless the user explicitly asks for a full report.
