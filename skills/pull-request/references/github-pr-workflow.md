# GitHub PR workflow 기준

## 공식 문서에서 확인한 핵심

- GitHub pull request는 branch의 변경을 제안하고 협업하기 위한 단위다. default branch에는 finished and approved work만 남기는 구조를 전제로 한다.
- PR은 서로 다른 두 branch 사이에서 열린다. base branch는 변경이 적용될 대상이고, head branch는 적용할 commit을 가진 branch다.
- GitHub CLI의 기본 명령은 `gh pr create`다.
- `gh pr create`는 `--base`, `--head`, `--title`, `--body`, `--body-file`, `--draft`, `--reviewer`, `--label`, `--milestone`, `--project`, `--template` 같은 flag를 제공한다.
- PR body에서 `Fixes #123` 또는 `Closes #123`처럼 issue를 참조하면 merge 시 해당 issue가 자동으로 close될 수 있다.
- 현재 branch가 remote에 완전히 push되지 않았으면 `gh pr create`가 push/fork 관련 prompt를 낼 수 있다. 자동화에서는 먼저 branch push 상태를 확인한다.
- `--dry-run`은 PR detail을 출력하지만 git change를 push할 수 있으므로, dry-run도 안전한 read-only 명령으로 가정하지 않는다.

## PR 생성 전 점검

```bash
git status --short --branch
git remote -v
git branch --show-current
git rev-parse --abbrev-ref --symbolic-full-name @{u}
gh auth status
gh pr status
```

## body template 기준

```markdown
## 요약

-

## 변경 범위

-

## 검증

- [ ]

## 위험과 rollback

-

## 관련 이슈

- Fixes #
```

이 skills repo에서는 PR title/body를 한국어로 작성한다. 스킬 변경 PR은 `skills/**/*.md`가 한국어 우선이어야 한다는 문장을 남기고, 검증 항목에 `node scripts/validate-korean-markdown.ts .`를 포함한다.

## 명령 선택

| 상황 | 명령 |
| --- | --- |
| 일반 PR 생성 | `gh pr create --base <base> --head <branch> --title <title> --body-file <file>` |
| 초안 PR | `gh pr create --draft --base <base> --head <branch> --title <title> --body-file <file>` |
| template 사용 | `gh pr create --template <file>` |
| reviewer 지정 | `gh pr create --reviewer <user-or-team>` |
| label 지정 | `gh pr create --label <name>` |
| 기존 PR 확인 | `gh pr view --json number,url,title,state,baseRefName,headRefName,isDraft` |

## 자동화 guardrail

- PR 생성은 remote write action이다. 사용자가 "PR 만들어줘", "create PR", "올려줘"처럼 명시할 때만 실행한다.
- push가 필요한 경우 `atomic-committer` 또는 사용자 지시와 함께 처리한다.
- merge/close/delete는 PR 생성보다 위험하므로 별도 명시 요청 없이는 하지 않는다.
- CI 실패, merge conflict, required review는 우회하지 않는다.
