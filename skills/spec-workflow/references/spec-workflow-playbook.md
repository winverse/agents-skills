# spec-workflow playbook 기준

## core idea 기준

`spec-workflow`는 `workflow suite`의 반복 개발 loop다. project setup 이후 이미 존재하는 spec, issue, bug repro, PRD section, ADR, design.md를 기준으로 작은 vertical slice를 검증 가능한 변경으로 끝낸다.

## read order 기준

1. root instruction
2. folder-local instruction
3. target spec, issue, bug report, acceptance criteria
4. `CONTEXT.md`, ADR, PRD
5. design.md, mock decision, testing docs
6. current diff와 test output

## fallback routing 기준

아래가 부족하면 바로 구현하지 않는다.

| 부족한 것 | 다음 행동 |
| --- | --- |
| product/domain/architecture 자체가 불명확함 | `project-workflow` handoff |
| acceptance criteria 없음 | light spec 작성 또는 사용자 확인 |
| UI direction 없음 | selected mock direction 또는 `design-review` handoff |
| tool/security gate 없음 | Agent Tool And Security Risk Gate 작성 |
| test surface 없음 | characterization 또는 runtime evidence 방식 정의 |

## implementation loop 기준

```text
spec authority -> plan -> plan review -> RED -> GREEN -> REFACTOR -> review -> QA -> docs sync -> completion
```

`writing-plans`는 작업을 2-5분 단위로 쪼개는 데만 쓴다. product scope를 새로 늘리는 데 쓰지 않는다.

## local implementation fallback lane 기준

Superpowers-style implementation helper가 없으면 fallback으로 issue-level implementation design, exact TDD 또는 characterization plan, RED/GREEN/REFACTOR evidence, non-browser runtime evidence를 직접 남긴다. 이 fallback은 project setup이 아니라 spec implementation loop 안에서만 실행한다.

## CLI/no-browser 기준

browser surface가 없으면 browser-qa, screenshot, mockup selection을 요구하지 않는다. command output, fixture result, API response, stdout, log, generated report 같은 non-browser runtime evidence를 남긴다.

## TDD lane 기준

- bug fix는 repro 또는 characterization check를 먼저 만든다.
- feature는 acceptance criteria 중 하나를 테스트로 고정한다.
- UI는 browser evidence와 accessibility snapshot을 test evidence와 함께 다룬다.
- 테스트를 만들 수 없으면 이유와 대체 command/runtime evidence를 남긴다.

## target code repo TDD hook 기준

이 shared skills repo에서는 TDD hook을 설치하거나 실행하지 않는다. 이 repo는 스킬 문서와 eval fixture를 관리하는 repo이며, production code 변경을 만들지 않는다.

대상 코드 repo에서 `spec-workflow`를 project instruction에 연결할 때만 project-local hook으로 TDD gate를 강제한다. 전역 hook 설치나 shared skills repo hook 추가는 하지 않는다.

권장 gate는 아래 순서다.

1. production code edit을 감지한다.
2. 같은 작업에 RED evidence가 있는지 확인한다.
3. RED evidence가 없으면 characterization evidence를 확인한다.
4. 둘 다 없으면 `tdd-exception.md` 또는 workflow log의 명시적 예외 사유를 확인한다.
5. 셋 다 없으면 warn 또는 block으로 처리한다.

hook이 인정할 evidence는 target repo가 정한다.

```text
TDD Gate Evidence
- test file: **/*.test.* 또는 **/*.spec.*
- characterization: .scratch/<feature-slug>/test-evidence.md
- RED log: .scratch/<feature-slug>/workflow-log.md 안의 RED:
- exception: .scratch/<feature-slug>/tdd-exception.md
```

운영은 처음부터 hard block으로 시작하지 않는다. target code repo에서 `warn` 모드로 누락 패턴을 본 뒤, 안정화되면 `block`으로 올린다.

## subagent lane 기준

큰 구현에서만 `subagent-driven-development`를 선택한다. task는 파일/모듈 ownership이 분리되어야 하고, 각 task는 spec review와 code quality review를 통과해야 한다.

## completion/ship 기준

completion은 release publishing이 아니다. commit, push, deploy, tag, GitHub release는 사용자가 명시적으로 요청한 경우에만 `atomic-committer` 또는 별도 release workflow로 넘긴다.

완료 전에는 review, QA/runtime evidence, document-sync, artifact hygiene, secret guard 필요 여부를 확인한다. document-sync -> `sync-docs`, semantic-commits -> `atomic-committer`, ship -> release checklist처럼 source workflow 이름을 repo-local helper로 매핑한다.

## workflow-state cache 기준

`workflow-state.md`가 있으면 먼저 읽고, 반복 실행 후 새 evidence와 결정만 덧붙인다. 이 파일은 authority가 아니라 다음 spec 실행을 빠르게 하는 cache다.

```text
Workflow State Update
- reused authority:
- selected primitives:
- skipped/fallback primitives:
- RED/GREEN/REFACTOR:
- QA/runtime evidence:
- docs sync:
- next open question:
```

## improvement seed 기준

자가개선은 모든 완료마다 무겁게 실행하지 않는다. 아래 상황이 있었을 때만 `agent-eval-harness` 후보를 남긴다.

- wrong workflow routing
- missing setup gate
- skipped RED/GREEN/REFACTOR without reason
- repeated QA or docs sync omission
- tool/security gate 누락

후보는 `.scratch/<feature-slug>/eval-candidates/` 아래에 prompt, expected skill, missing gate, required evidence를 짧게 기록한다.

## workflow log 기준

```text
YYYY-MM-DD | <spec or issue>
- authority:
- selected primitives:
- RED:
- GREEN:
- REFACTOR:
- QA:
- docs sync:
- completion:
```
