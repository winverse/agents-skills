# 원자적 커밋 그룹 규칙

## changeset 정의

changeset은 하나의 이유로 함께 바뀐 파일 묶음이다. 사용자가 같은 PR에서 이해하고 revert할 수 있어야 한다.

## grouping priority 기준

1. 기능 동작 변경
2. test 또는 eval 추가
3. 문서와 snippet 정합성
4. validator, hook, CI 같은 tooling
5. generated catalog 또는 lockfile
6. local artifact ignore rule

## forbidden content triage 기준

- staged diff와 working diff를 모두 본다.
- untracked file은 이름과 위치를 보고 cache, log, secret, local output인지 판단한다.
- credential-like path는 내용 확인 없이 commit하지 않는다.

## commit type 기준

| type | 사용 |
| --- | --- |
| `feat` | 새 기능, 새 스킬 |
| `fix` | bug, validator failure, broken link |
| `docs` | 문서만 변경 |
| `test` | test/eval |
| `chore` | repo maintenance |
| `ci` | CI와 automation |

## ambiguous case 기준

- 한 파일에 두 논리가 섞이면 hunk split을 시도한다.
- split이 위험하면 사용자에게 묻는다.
- unrelated dirty file은 stage하지 않는다.
