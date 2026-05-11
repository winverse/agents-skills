---
name: changeset-committer
description: Use when the user asks to commit, split work into commits, create git commits, or commit and push. This skill inspects changed files, groups them into logical changesets, commits each group with an English conventional prefix and Korean message body, and pushes only when a git remote exists and push was requested.
---

# Changeset Committer

Use this skill when the user asks for committing work, splitting changes into commits, or committing and pushing.

Detailed grouping heuristics live in `references/grouping-rules.md`; read it when the dirty tree has more than one concern, staged changes already exist, or the commit grouping is not obvious.

## Core Contract

- Commit by logical changeset, not by every dirty file at once.
- Stage only the files or hunks that belong to the current changeset.
- Preserve unrelated user changes. Do not revert, discard, or silently include them.
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
3. Identify logical changesets from file paths, diffs, tests, generated files, docs, and user intent.
4. If a file mixes unrelated concerns, split by hunk when practical; otherwise ask before committing that file.
5. For each changeset:
   - Stage only that changeset.
   - Run targeted validation when practical and relevant.
   - Commit with the required message format.
6. After commits, push only if:
   - the user requested push,
   - `git remote` has at least one remote,
   - the branch is not detached,
   - and local commits need to be published.
7. If no remote exists, do not push. Report the commit hashes and say push was skipped because no remote is configured.

## Safety Rules

- Do not use destructive commands such as `git reset --hard`, `git checkout --`, or file deletion to make the tree cleaner.
- Do not stage ignored build artifacts unless the diff clearly shows they are intentional source artifacts.
- Do not commit secrets, personal absolute paths, credentials, `.env` files, or machine-local caches.
- Do not amend, rebase, squash, force-push, or rewrite history unless the user explicitly asks.
- If validation fails, stop before push and report which commit or changeset is blocked.

## Final Report

Summarize:

- commits created, with hashes and messages,
- skipped dirty files, if any,
- validation run and result,
- whether push happened, and to which remote/branch.
