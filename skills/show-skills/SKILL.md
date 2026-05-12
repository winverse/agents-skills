---
name: show-skills
description: Use when the user asks to see, list, browse, summarize, choose, compare, or discover the current skills in this repository, or asks which skill to use for a task. This skill reads the repo's current skill packages, groups them by use case, shows paths to SKILL.md and skill.html, and recommends relevant skill combinations without requiring the user to open files manually.
---

# Show Skills

Use this skill to show the current skill catalog instead of making the user click through files manually. It works in this shared repo and in other repos or installed skill directories when given a skills root.

## Core Contract

- Treat the current filesystem as the source of truth.
- Prefer running the bundled `show-skills` script to avoid stale hand-written lists.
- Accept both layouts:
  - repo layout: `<repo>/skills/<skill-name>/SKILL.md`;
  - installed layout: `<skills-root>/<skill-name>/SKILL.md`.
- Use `--root <path>` or `SKILLS_ROOT=<path>` when the current working directory is not the skills catalog root.
- Use `docs/skill-catalog.md` as an optional static human catalog when it exists. Do not require it in downloaded or standalone installs.
- Include `SKILL.md` and `skill.html` paths so the user can inspect details when needed.
- Recommend skill combinations when one request naturally spans multiple skills.
- Do not install, register, or globally enable skills while listing them.

## Workflow

1. Run the listing script from the repo root or installed skill root:

   ```bash
   node skills/show-skills/scripts/show-skills.ts
   ```

2. If the skill is installed elsewhere or the target catalog is different, pass the root:

   ```bash
   node <skills-root>/show-skills/scripts/show-skills.ts --root <skills-root>
   ```

   For this repo, either the repo root or `skills/` works:

   ```bash
   node skills/show-skills/scripts/show-skills.ts --root .
   node skills/show-skills/scripts/show-skills.ts --root skills
   ```

3. If the user asks for a shorter view, use:

   ```bash
   node skills/show-skills/scripts/show-skills.ts --compact
   ```

4. If the user asks for machine-readable output, use:

   ```bash
   node skills/show-skills/scripts/show-skills.ts --format json
   ```

5. If the user asks what to use for a task, inspect the output and answer with:
   - the best primary skill;
   - optional companion skills;
   - the reason;
   - exact paths to inspect.

## Selection Heuristics

- Current facts, citations, market/product/legal/technical lookup: `web-research`.
- Creating or refreshing human visual guides: `skill-to-html`.
- Updating an existing shared skill package: `skill-update`.
- Documentation consistency: `sync-docs`.
- Repo or skill quality loops: `agent-improvement-loop`.
- Browser runtime proof: `browser-qa`.
- Code review: `code-review`.
- UI/design critique: `design-review`.
- Coding discipline: `karpathy-thinkings`.
- Project folder structure: `project-structure`.
- Commit grouping and push: `atomic-committer`.

## Output Shape

Use a compact answer:

```text
현재 스킬
- <category>: <skill names>

추천
- Primary: <skill> - <why>
- Pair with: <skill> - <why>

자세히 보기
- docs/skill-catalog.md
- skills/<skill>/skill.html
```
