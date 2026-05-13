# 프로젝트 workflow playbook

## core idea 기준

workflow는 구현 전 질문을 오래 끌기 위한 문서가 아니다. 구현이 잘못된 방향으로 빨리 가는 것을 막고, 필요한 artifact만 만들어 다음 단계로 넘긴다.

## read order 기준

1. root instruction
2. folder-local instruction
3. README와 domain docs
4. ADR과 PRD
5. issue와 current diff

## dependency inventory 기준

외부 skill family는 available, missing, fallback으로 표시한다. source skill 이름은 `setup-matt-pocock-skills`, `grill-me`, `grill-with-docs`, `office-hours`, `plan-ceo-review`, `to-prd`, `to-issues`, `triage`, `brainstorming`, `writing-plans`, `plan-eng-review`, `subagent-driven-development`, `tdd`, `review`, `qa`, `diagnose`, `document-sync`, `semantic-commits`, `ship`처럼 원문을 유지한다.

## scenario lanes 기준

### raw new SaaS/service 기준

domain language, target user, first usable slice, ADR, PRD 순서로 간다.

Docker/AWS/Pulumi가 필요한 새 서비스는 infra lane으로 넘기되, runtime과 secret boundary를 먼저 확인한다.

### existing backend/API cleanup 기준

현재 architecture와 behavior를 보존할 evidence를 먼저 정하고, cleanup issue를 vertical slice로 나눈다.

### substantial UI 기준

2-3 mock direction을 만들고 사용자가 선택한 뒤 구현한다. 방향 품질을 속도보다 우선한다.

### CLI/no-browser

browser evidence 대신 command output, fixture, snapshot, log를 남긴다.

### MCP/API/file-write automation 기준

Agent Tool And Security Risk Gate를 작성한다. 권한, destructive action, secret, untrusted content를 분리한다.

### completion/ship

validation, docs sync, atomic commit, push/deploy 조건을 확인한다.

이 repo에서 `/goal`이라고 쓰면 Claude Code의 `/goal` 기능을 뜻한다. Claude Code에서는 completion/ship 전에 goal condition을 제안한다. Codex, Cursor, Copilot, Windsurf처럼 같은 slash command가 없거나 확인되지 않은 runtime에서는 같은 내용을 checklist artifact로 남긴다.

## project-structure handoff 기준

folder/env/codegen/db/infra boundary가 필요할 때만 `project-structure`를 호출한다. raw idea discovery 중에는 호출하지 않는다.

## PRD settings 기준

PRD에는 problem, user, first usable slice, included scope, excluded scope, acceptance criteria, risk를 포함한다.

CONTEXT.md or ADR이 없으면 PRD와 issue 생성을 바로 시작하지 않는다.

## local implementation fallback lane 기준

helper skill이 없으면 issue-level implementation design, exact TDD plan, RED -> GREEN -> REFACTOR evidence, non-browser runtime evidence를 만든다.

## workflow log 기준

```text
YYYY-MM-DD | <stage>
- decision:
- artifact:
- validation:
```

## completion gate 기준

context, artifact, validation, docs sync, commit/ship mapping이 맞아야 완료한다.

Project Setup Verification은 연결된 skill path, snippet, no-global-install 조건을 확인한다. completion/ship 기준은 validation, docs sync, atomic commit, push/deploy 조건이 모두 맞는지 보는 것이다.

## goal condition recipe 기준

```text
/goal <measurable end state> and <stated check evidence appears in transcript>; constraints: <scope and forbidden changes>; stop after <turn/time bound>
```

좋은 조건은 agent가 출력으로 증명할 수 있는 상태여야 한다. 예: `node scripts/run-agent-evals.ts exits 0`, `git status is clean`, `PR URL is reported`. 나쁜 조건은 `좋아질 때까지`, `완벽할 때까지`처럼 증거와 종료 기준이 없는 문장이다.
