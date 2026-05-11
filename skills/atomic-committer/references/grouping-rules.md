# Atomic Commit Grouping Rules

Use these rules when a dirty git tree contains multiple concerns.

## Changeset Definition

A changeset is the atomic commit unit: a group of edits that should be reviewed, reverted, or cherry-picked together.

Good changesets usually share one of these:

- one user-visible feature
- one bug fix
- one refactor with no behavior change
- one documentation update
- one test update for a specific behavior
- one build, dependency, CI, or tooling change
- one generated artifact update caused by a source change

## Grouping Priority

Prefer grouping by intent over file type.

1. User request or issue being solved
2. Runtime behavior changed
3. Tests for that behavior
4. Docs or snippets explaining that behavior
5. Tooling or generated files required by the same change

Do not combine unrelated work just because it is in the same directory.

## Common Commit Types

| Type | Use when |
| --- | --- |
| `feat` | new user-facing capability, new skill, new workflow |
| `fix` | bug fix, broken link, incorrect validator, rendering defect |
| `docs` | documentation-only update |
| `refactor` | code restructuring with no behavior change |
| `test` | tests or eval prompts only |
| `chore` | repo maintenance, metadata, housekeeping |
| `build` | dependency, package, build system |
| `ci` | CI or automation workflow |
| `style` | formatting-only changes with no behavior or docs meaning change |
| `perf` | performance improvement |
| `revert` | revert a previous commit |

## Commit Message Rules

- Prefix is English.
- Summary is Korean.
- Use imperative or noun phrase Korean, but keep it short.
- Do not end the subject with a period.
- Keep the first line concise.

Examples:

```text
feat: 변경사항 단위 커밋 스킬 추가
fix: 스킬 HTML의 깨진 validator 링크 수정
docs: 수동 스킬 연결 절차 정리
chore: repo lifecycle 검증 추가
test: 웹 리서치 평가 프롬프트 보강
```

## Push Rules

Push is allowed only when all are true:

- user asked to push or asked for "commit and push"
- current directory is inside a git repo
- at least one remote exists
- current branch is not detached
- commits are complete and validation is not blocking

If no remote exists, skip push and say why.

If upstream is missing, prefer:

```bash
git push -u <remote> <branch>
```

If upstream exists, prefer:

```bash
git push
```

Do not force-push unless explicitly requested.

## Ambiguous Cases

Ask before committing when:

- the same file contains multiple unrelated changes and hunk splitting is risky
- staged changes appear to be user-prepared but the requested grouping conflicts with them
- a file looks secret-bearing or machine-local
- generated files are large and the source cause is unclear
- commit type is unclear between behavior and maintenance
