# workflow upstream dependency map 기준

## source references 기준

이 파일은 workflow가 참고하는 외부 skill family와 local fallback boundary를 기록한다. 외부 source가 바뀌면 무조건 복제하지 않고 handoff, stage, artifact, validator boundary만 갱신한다.

## dependency ledger 기준

| source skill | local role |
| --- | --- |
| `setup-matt-pocock-skills` | skill inventory와 setup |
| `grill-me`, `grill-with-docs` | domain interview |
| `office-hours` | product challenge |
| `plan-ceo-review` | product decision review |
| `to-prd` | PRD 작성 |
| `to-issues` | issue split |
| `plan-eng-review` | engineering review |
| `subagent-driven-development`, `tdd` | implementation evidence |
| `review`, `qa`, `diagnose` | verification |
| `document-sync` | docs sync |
| `semantic-commits`, `ship` | completion |

## update-following rule 기준

upstream source skill이 바뀌면 local workflow의 trigger와 artifact boundary만 검토한다. source wording 전체를 가져오지 않는다.

## duplicate boundary guardrails 기준

`workflow`는 orchestration을 맡고, folder structure는 `project-structure`, docs drift는 `sync-docs`, eval은 `agent-eval-harness`, commit은 `atomic-committer`가 맡는다.

## mockup direction gate 기준

substantial UI는 implementation 전에 2-3 방향을 제시하고 사용자 선택을 받는다. 선택 전 대규모 UI coding을 하지 않는다.
