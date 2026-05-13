---
name: pull-request
description: "GitHub pull request를 준비, 생성, 업데이트, 초안 전환, reviewer/label/base/head/body를 관리하거나 PR 설명을 작성할 때 사용한다. commit 생성은 atomic-committer가 맡고, code review는 code-review가 맡는다."
---

# Pull Request 스킬

이 스킬은 이미 커밋된 변경을 GitHub pull request로 안전하게 제출하거나 기존 PR을 정리할 때 사용한다. 핵심은 base/head branch 확인, PR body 품질, issue 연결, draft/review 상태, push/remote 권한을 명확히 하는 것이다.

공식 GitHub CLI와 GitHub Docs 기준을 확인할 때는 `references/github-pr-workflow.md`를 읽는다.

## 책임 경계

- 커밋 생성, secret guard, atomic commit 분리는 `atomic-committer`가 먼저 맡는다.
- diff 자체의 버그/회귀 리뷰는 `code-review`가 맡는다.
- 이 스킬은 PR 준비, 생성, 설명 작성, reviewer/label/assignee/milestone/project 지정, draft 여부, 기존 PR 업데이트를 맡는다.
- merge, auto-merge, branch 삭제, force-push, PR close/reopen은 사용자가 명시할 때만 다룬다.

## 기본 workflow

1. `git status --short --branch`, `git remote -v`, `git branch --show-current`로 worktree, remote, branch를 확인한다.
2. 현재 branch가 base branch인지 확인한다. base branch에서 바로 PR을 만들려 하지 않는다.
3. local commit이 remote에 올라갔는지 확인한다. push가 필요하면 사용자의 요청과 remote/branch를 확인한다.
4. `gh auth status`와 `gh pr status` 또는 `gh pr view`로 GitHub CLI 사용 가능 여부와 기존 PR 여부를 확인한다.
5. base/head를 명시한다. base는 보통 default branch이고 head는 현재 feature branch다.
6. PR title/body를 작성한다. template이 있으면 우선 사용하고, 없으면 summary, changes, validation, risk, linked issue를 포함한다.
7. 생성 전에는 가능하면 `gh pr create --dry-run` 또는 명령 preview를 보여준다. dry-run도 push할 수 있으므로 branch push 여부를 먼저 확인한다.
8. 사용자가 PR 생성을 요청했을 때만 `gh pr create`를 실행한다.

## 이 repo의 PR 규칙

- PR title과 body는 한국어로 작성한다. code identifier, 명령, 파일 경로, GitHub 용어는 원문을 유지할 수 있다.
- `.github/pull_request_template.md`가 있으면 우선 사용하고, 없더라도 같은 구조를 따른다.
- 스킬 변경 PR은 `skills/**/*.md`가 한국어 우선 문서라는 규칙을 본문에 적고, `node scripts/validate-korean-markdown.ts .` 실행 여부를 validation에 남긴다.
- behavior change가 있으면 `SKILL.md`, `references/`, `skill.html`, `project-snippets/`, `history/skills.md`, validator, eval case가 함께 맞았는지 scope에 적는다.
- PR 본문에는 summary, changed scope, validation, risk/rollback, linked issues를 같은 순서로 남긴다.

## goal condition 기준

이 repo에서 `/goal`이라고 쓰면 Claude Code의 `/goal` 기능을 뜻한다. Claude Code에서 PR 준비를 오래 돌릴 때는 다음 조건을 제안할 수 있다.

```text
/goal PR body follows .github/pull_request_template.md, validation evidence is shown, risk/rollback is filled, and a PR URL or exact gh command preview is reported; stop after 6 turns
```

다른 runtime에서는 같은 문장을 PR checklist로 사용한다. goal condition은 PR merge, close, force-push, branch delete 같은 위험 작업을 포함하면 안 된다.

## PR body 기준

- 변경 요약: 무엇이 바뀌었는지 2-4개 bullet로 적는다.
- 변경 범위: 어떤 skill, snippet, docs, validator, eval, template이 바뀌었는지 적는다.
- 검증: 실제 실행한 test, validator, browser check, 미실행 항목을 구분한다.
- 위험: migration, secret, permission, UI, runtime, infra 영향이 있으면 적는다.
- rollback: 문제가 생겼을 때 되돌릴 파일이나 branch 전략을 적는다.
- issue 연결: merge 시 자동 close가 필요하면 `Fixes #123` 또는 `Closes #123`를 body에 넣는다.
- reviewer/label/project/milestone은 사용자 요청이나 repo 관례가 있을 때만 지정한다.

## GitHub CLI 기준

- 새 PR: `gh pr create --base <base> --head <branch> --title <title> --body-file <file>`
- draft PR: `gh pr create --draft ...`
- reviewer 요청: `gh pr create --reviewer <user-or-team>`
- label/milestone/project: `--label`, `--milestone`, `--project`
- template 사용: `gh pr create --template <file>`
- 기존 PR 확인: `gh pr view --json number,url,title,state,baseRefName,headRefName,isDraft`

## 안전 규칙

- 사용자가 명시하지 않으면 merge, auto-merge, close, reopen, branch delete, force-push를 하지 않는다.
- PR body에 secret, private path, raw credential, internal transcript를 넣지 않는다.
- `gh`가 없거나 인증되지 않았으면 PR 생성 명령을 실행하지 말고 필요한 명령과 body draft를 제공한다.
- fork가 필요한 상황은 자동으로 진행하지 말고 base/head/fork owner를 확인한다.

## 출력 형식

```text
PR 상태
- branch/base/head/remote:

PR 초안
- title:
- body:

실행
- <gh command 또는 dry-run 결과>

검증
- <명령>: <결과>
```
