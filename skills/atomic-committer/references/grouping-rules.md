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
2. Forbidden-content and secret safety
3. Runtime behavior changed
4. Tests for that behavior
5. Docs or snippets explaining that behavior
6. Tooling or generated files required by the same change

Do not combine unrelated work just because it is in the same directory.

## Forbidden Content Triage

Run this triage before staging a changeset and again on the staged diff before `git commit`.

Inspect:

- `git diff --stat`
- `git diff --no-ext-diff`
- `git diff --cached --no-ext-diff`
- untracked files from `git status --short`

For the final hard block, inspect the exact staged candidate with:

```bash
git diff --cached -U0 --no-ext-diff
```

Hard-block the commit if added lines contain live-looking credential assignments or private key material. These cannot be overridden by a user request to force the commit:

- Credential-like names followed by assignment syntax and live-looking values. Assignment syntax includes `.env` style `NAME=value`, shell `export NAME=value`, YAML `name: value`, JSON `"name": "value"`, and TOML `name = "value"`.
- Cloud credentials for AWS, GCP, Azure, Supabase, Firebase, and Vercel when values are not placeholders. AWS examples include `AWS_ACCESS_KEY=...`, `AWS_ACCESS_KEY_ID=...`, `AWS_SECRET_ACCESS_KEY=...`, and `AWS_SESSION_TOKEN=...`.
- Source control, AI API, payment, messaging, and package registry tokens such as `GITHUB_TOKEN`, `GH_TOKEN`, `GITLAB_TOKEN`, `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `SLACK_BOT_TOKEN`, `STRIPE_SECRET_KEY`, `NPM_TOKEN`, and `SENDGRID_API_KEY`.
- Connection strings such as `DATABASE_URL`, `REDIS_URL`, `MONGODB_URI`, or `POSTGRES_URL` when the URL contains a real-looking username/password or token.
- AWS access key IDs matching `AKIA[0-9A-Z]{16}` or `ASIA[0-9A-Z]{16}`.
- Private key blocks such as `-----BEGIN PRIVATE KEY-----`, `-----BEGIN RSA PRIVATE KEY-----`, or `-----BEGIN OPENSSH PRIVATE KEY-----`.
- Obvious live token assignments such as `api_key=`, `client_secret=`, `secret=`, `password=`, `token=`, or `github_token=` when the value is not a placeholder.

Treat a value as live-looking when it is long, high-entropy, provider-shaped, base64/hex-like, JWT-shaped, URL credential-shaped, or otherwise not clearly fake.

Treat these as placeholders unless the surrounding diff proves otherwise:

- empty values
- `example`, `placeholder`, `changeme`, `dummy`, `fake`, `test`, `xxx`
- `your_key_here`, `REPLACE_ME`, `<...>`, `${...}`
- redacted values such as `sk-...REDACTED`

Warn and ask before committing when the candidate includes:

- `.env.example`, test fixtures, or docs with placeholder secret names.
- secret variable names without assigned values, or with clear placeholder values.
- credential-like paths such as `.aws/`, `.ssh/`, `credentials`, or `secrets`.
- local machine state such as screenshots, caches, editor settings, or absolute paths.
- large generated files whose source change is unclear.

When a hard block is found, stop the commit, report the category and file, and ask the user to redact or remove the content. Do not stage a workaround and do not push.

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
