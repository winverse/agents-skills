## Project Skills

- Use $pull-request at <skills-root>/skills/pull-request/SKILL.md when asked to prepare, create, update, draft, or manage a GitHub pull request, including PR title/body, base/head branch, reviewers, labels, milestones, linked issues, or `gh pr create`.

## Project Skill Overrides

- Use `atomic-committer` before `pull-request` when commits still need to be created or pushed.
- Use `code-review` before `pull-request` when the user asks for PR review findings.
- Check branch, remote, upstream, `gh auth status`, and existing PR state before creating or updating a PR.
- Run `gh pr create` only when the user explicitly asks to create a PR. Otherwise provide the PR title/body and command preview.
- For this skills repo, write PR title/body in Korean and follow `.github/pull_request_template.md`: summary, scope, validation, risk/rollback, linked issues.
- For skill changes, explicitly note that repo-owned `skills/**/*.md` documents are Korean-first and include `node scripts/validate-korean-markdown.ts .` in validation.
- In this repo, `/goal` means Claude Code's `/goal` feature. For long PR preparation on Claude Code, use a condition that requires template compliance, validation evidence, risk/rollback, and PR URL or exact command preview, with a turn bound. Otherwise use the same condition as a checklist.
- Do not merge, close, reopen, delete branches, enable auto-merge, or force-push unless the user explicitly asks for that operation.
