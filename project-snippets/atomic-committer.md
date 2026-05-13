## Project Skills

- Use $atomic-committer at <skills-root>/skills/atomic-committer/SKILL.md when asked to commit, split changes into commits, create multiple logical commits, or commit and push.

## Project Skill Overrides

- Commit messages must use an English conventional prefix such as `feat`, `fix`, `docs`, or `chore`, followed by a Korean summary.
- Group changed files by logical changeset before committing.
- Before staging and before committing, scan candidate changes for forbidden content. Hard-block live-looking credential assignments and private-key material across common providers. For example, block `AWS_ACCESS_KEY=...` only when the assigned value looks real rather than placeholder text, and do not allow force-commit overrides.
- When untracked local artifacts, `.env` files, credential paths, logs, caches, raw screenshots, or tool state should never be committed, update the project `.gitignore` with the narrowest safe pattern before committing other changes. Do not use `.gitignore` to hide already tracked secrets; ask before `git rm --cached`.
- Push only when a git remote exists and the user requested push.
