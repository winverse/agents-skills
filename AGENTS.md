# Skills Repo Instructions

This repo stores custom Codex skills that are applied manually per project.

## Core Rules

- Do not install, symlink, or auto-register repo skills into `~/.codex/skills` unless the user explicitly asks.
- Do not treat default Codex skills as the preferred behavior when a custom skill in this repo covers the same job.
- Keep this repo as the source of truth for project-selectable skills.
- Configure projects by linking skill `SKILL.md` files from this repo inside each project's `AGENTS.md`.
- `skill-creator` is not owned by this repo. It is an external system skill at `/Users/winverse/.codex/skills/.system/skill-creator/SKILL.md`.

## Structure

- Skill folders live at repo root, for example `web-research/`.
- Each skill folder must include `SKILL.md` for Codex and `skill.html` for human install-time reading.
- Project-ready snippets live in `project-snippets/`.
- Workflow docs live in `docs/`.
- Personal taste and deeper guidance should live inside each skill's `references/` folder.

## Editing Skills

- Use the system `skill-creator` for skill scaffolding and validation scripts.
- Keep `SKILL.md` concise and trigger-focused.
- Put long preferences, source rules, examples, and project-specific variants in references or snippets.
- Use `skill-to-html/SKILL.md` when creating or revising a skill's `skill.html`.
- Update that skill's `skill.html` when adding, removing, renaming, or materially changing a skill.
- Make `skill.html` diagram-rich: include decision matrices, flowcharts, charts, resource maps, or input/output schemas instead of only splitting text into panels.
- Validate changed skills with the skill creator validator before calling them done.

## Project Setup

When asked to set up skills for a project:

1. Read this repo's `README.md`.
2. Select only the skills relevant to that project.
3. Add links to those skills in the target project's `AGENTS.md`.
4. Add project-specific overrides in the target project, not in the shared skill, unless the preference should apply everywhere.
