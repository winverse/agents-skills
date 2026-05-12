---
name: atomic-committer
description: Use when the user asks to commit, split work into commits, create git commits, or commit and push. This skill inspects changed files, blocks forbidden secret-bearing content, groups safe changes into atomic commit units, commits each group with an English conventional prefix and Korean message body, and pushes only when a git remote exists and push was requested.
---

# Atomic Committer

Use this skill when the user asks for committing work, splitting changes into commits, or committing and pushing.

Detailed grouping heuristics live in `references/grouping-rules.md`; read it when the dirty tree has more than one concern, staged changes already exist, or the commit grouping is not obvious.

## Core Contract

- Commit by logical changeset, not by every dirty file at once.
- Stage only the files or hunks that belong to the current changeset.
- Preserve unrelated user changes. Do not revert, discard, or silently include them.
- Before staging and before committing, scan the candidate changeset for forbidden content and warn about risky content.
- Hard-block credential-like assignments only when the value looks live rather than placeholder text. This applies across cloud, source control, AI API, payment, messaging, package registry, database, and private-key secrets.
- Use commit messages with an English conventional prefix and a Korean summary.
- Push only when the current directory is a git repo, at least one commit was created or already requested, a remote exists, and the user asked to push.

## Message Format

Use this format:

```text
<type>: <한글 요약>
```

Scope is allowed when it improves clarity:

```text
<type>(<scope>): <한글 요약>
```

Preferred types:

```text
feat, fix, docs, refactor, test, chore, build, ci, style, perf, revert
```

Examples:

```text
feat: 변경사항 단위 커밋 스킬 추가
fix(web-research): HTML validator 링크 수정
docs: 프로젝트 스킬 연결 방법 정리
chore: 스킬 repo 검증 스크립트 갱신
```

## Workflow

1. Confirm the current directory is inside a git worktree with `git rev-parse --show-toplevel`.
2. Inspect state with `git status --short`, `git diff --stat`, `git diff`, and `git diff --cached` when staged changes exist.
3. Run forbidden-content triage over the working diff, staged diff, and untracked candidate files before deciding commit groups.
4. Identify logical changesets from file paths, diffs, tests, generated files, docs, and user intent.
5. If a file mixes unrelated concerns, split by hunk when practical; otherwise ask before committing that file.
6. For each changeset:
   - Warn about risky but not strictly forbidden content before staging.
   - Stage only that changeset.
   - Re-scan `git diff --cached -U0 --no-ext-diff` for live-looking credential assignments and private-key material.
   - Run targeted validation when practical and relevant.
   - Commit with the required message format only if the staged diff passes the guard.
7. After commits, push only if:
   - the user requested push,
   - `git remote` has at least one remote,
   - the branch is not detached,
   - and local commits need to be published.
8. If no remote exists, do not push. Report the commit hashes and say push was skipped because no remote is configured.

## Forbidden Content Guard

Treat this guard as non-optional. A user can ask to include a risky generated file after review, but cannot override a hard-blocked live-looking credential-bearing line.

Hard-block the commit when the candidate staged diff adds any of these:

- Credential-like names followed by assignment syntax and a live-looking value. Assignment syntax includes `.env` style `NAME=value`, shell `export NAME=value`, YAML `name: value`, JSON `"name": "value"`, and TOML `name = "value"`.
- Cloud credentials such as AWS, GCP, Azure, Supabase, Firebase, or Vercel tokens when the assigned value is not a placeholder. AWS examples include `AWS_ACCESS_KEY=...`, `AWS_ACCESS_KEY_ID=...`, `AWS_SECRET_ACCESS_KEY=...`, and `AWS_SESSION_TOKEN=...`.
- Source control, AI API, payment, messaging, and package registry tokens such as `GITHUB_TOKEN`, `GH_TOKEN`, `GITLAB_TOKEN`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `SLACK_BOT_TOKEN`, `STRIPE_SECRET_KEY`, `NPM_TOKEN`, or `SENDGRID_API_KEY` when the value looks real.
- Connection strings such as `DATABASE_URL`, `REDIS_URL`, `MONGODB_URI`, or `POSTGRES_URL` when the URL includes a real-looking username/password or token.
- AWS access key ID values matching `AKIA[0-9A-Z]{16}` or `ASIA[0-9A-Z]{16}`.
- Private key material such as `-----BEGIN PRIVATE KEY-----`, `-----BEGIN RSA PRIVATE KEY-----`, or `-----BEGIN OPENSSH PRIVATE KEY-----`.
- Obvious live token assignments such as `api_key=`, `client_secret=`, `secret=`, `password=`, `token=`, or `github_token=` with a non-placeholder value.

A value is live-looking when it is long, high-entropy, provider-shaped, base64/hex-like, JWT-shaped, URL credential-shaped, or otherwise not clearly fake. Treat these as placeholders unless the surrounding diff proves otherwise: empty values, `example`, `placeholder`, `changeme`, `dummy`, `fake`, `test`, `xxx`, `your_key_here`, `<...>`, `${...}`, `REPLACE_ME`, and obviously redacted values such as `sk-...REDACTED`.

Warn and ask before committing, but allow after explicit confirmation when the content is explainable and not a live secret:

- `.env.example`, docs, or tests that show placeholder values.
- Secret variable names without assigned values, or with clear placeholder values.
- Large generated files whose source is unclear.
- Machine-local paths, local screenshots, caches, or tool state.
- Files under credential-like paths such as `.aws/`, `.ssh/`, `credentials`, or `secrets`.

If hard-blocked content appears, stop before commit. Report the file or diff line category, ask the user to remove or redact it, and do not commit or push that changeset.

## Safety Rules

- Do not use destructive commands such as `git reset --hard`, `git checkout --`, or file deletion to make the tree cleaner.
- Do not stage ignored build artifacts unless the diff clearly shows they are intentional source artifacts.
- Do not commit secrets, personal absolute paths, credentials, `.env` files, or machine-local caches.
- Do not bypass the forbidden-content guard with `--no-verify`, force options, manual staging, or a user request to "commit anyway".
- Do not amend, rebase, squash, force-push, or rewrite history unless the user explicitly asks.
- If validation fails, stop before push and report which commit or changeset is blocked.

## Final Report

Summarize:

- commits created, with hashes and messages,
- skipped dirty files, if any,
- validation run and result,
- whether push happened, and to which remote/branch.
