# 에이전트 개선 루프 체크리스트

## 하나의 스킬인가, 둘인가

- 같은 failure mode를 고치면 하나의 개선 단위로 묶는다.
- 서로 다른 trigger, validator, docs를 건드리면 별도 단위로 나눈다.
- commit이 필요하면 `atomic-committer` 기준으로 logical changeset을 분리한다.

## budget router 기준

| 상황 | 처리 |
| --- | --- |
| 사용자가 spend-down을 명시 | 예/아니오 consent gate를 먼저 실행 |
| 작은 품질 개선 요청 | 한 lane만 처리하고 검증 |
| 여러 스킬 drift | skills repo track으로 inventory부터 확인 |
| 앱 repo 품질 개선 | general repo track으로 test/docs/hook 순서 확인 |

## staged review 기준

1. 현재 상태와 dirty tree를 확인한다.
2. 가장 작은 durable artifact 후보를 고른다.
3. 변경 전에 검증 기준을 정한다.
4. 수정 후 validator/test를 실행한다.
5. 실패하면 범위를 넓히기 전에 원인을 좁힌다.

## 완료 기준

- 개선 이유가 파일에 남아 있다.
- 검증 명령이 실제로 실행됐다.
- user change를 되돌리지 않았다.
- 다음 backlog가 있으면 별도 항목으로 남긴다.
