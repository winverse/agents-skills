---
name: workflow
description: "프로젝트 workflow를 설계, 실행, 리뷰, 문서화하고 idea를 domain docs, ADR, PRD, issue, TDD, QA, document sync, ship 단계로 연결할 때 사용한다."
---

# 프로젝트 workflow

이 스킬은 agent가 너무 빨리 coding으로 뛰어들지 않게 하는 orchestration layer다. product language, architecture, issue boundary, implementation evidence, ship step을 순서대로 만든다.

문서는 한국어로 남기고, 외부 skill 이름과 artifact 경로처럼 정확한 식별이 필요한 값만 원문을 유지한다. 사용자가 결과물을 직접 대조할 수 있도록 단계 이름과 판단 근거를 짧고 명확한 한국어로 적는다.

## dependency contract 기준

Matt Pocock-style, GStack-style, Superpowers-style, design-direction skill이 있으면 available/missing/fallback으로 inventory한다. 원본 skill이 없으면 local fallback lane으로 issue-level plan과 verification evidence를 만든다.

## 핵심 계약

- local project instructions와 docs를 먼저 읽는다.
- domain language를 stack choice보다 먼저 고친다.
- architecture decision은 PRD/issues 전에 ADR로 기록한다.
- vertical slice를 선호한다.
- substantial UI는 구현 전 2-3 mock direction과 사용자 선택을 거친다.
- tool, MCP, external API, file write, network, untrusted content는 Agent Tool And Security Risk Gate를 기록한다.
- 이 repo에서 `/goal`이라고 쓰면 Claude Code의 `/goal` 기능을 뜻한다. Claude Code에서는 긴 workflow에 session-scoped goal condition을 제안하고, 다른 agent에서는 같은 내용을 completion checklist로 남긴다.

## mode router 기준

| 요청 | lane |
| --- | --- |
| raw idea | discovery -> domain -> ADR |
| project structure | domain/architecture 질문 후 project-structure handoff |
| substantial UI | mockup selection 후 implementation |
| CLI/no-browser | non-browser runtime evidence |
| MCP/API automation | security risk gate |
| completion/ship | validation, docs sync, commit/ship mapping |

## default flow 기준

1. context 읽기
2. dependency inventory
3. domain language 정리
4. architecture question과 ADR
5. PRD settings
6. issue split
7. TDD 또는 local implementation fallback
8. QA/diagnose
9. document sync
10. semantic commit/ship

## artifact map 기준

`.scratch/<feature-slug>/` 아래에 notes, ADR, PRD, issues, plan, QA evidence, workflow log를 둔다.

## goal condition 기준

긴 작업, completion/ship, 대규모 refactor, backlog 처리에는 Claude Code 기준 `/goal` 또는 동등한 completion checklist를 만든다.

- measurable end state: 테스트 통과, file count, issue queue empty, PR URL처럼 판단 가능한 상태
- stated check: agent가 transcript에 남길 명령, 파일, evidence
- constraints: 건드리면 안 되는 파일, scope, secret, destructive action 금지
- turn/time bound: `20 turns 후 중단`처럼 runaway를 막는 한계

`/goal` evaluator는 스스로 명령을 실행하거나 파일을 읽지 않는다고 가정한다. 따라서 검증 증거를 agent output에 남기게 해야 한다.

## output shape 기준

```text
Runtime adapter
- <active instruction surface>

Dependencies:
- <available/missing/fallback>

Next workflow step
- <stage and artifact>
```
