# Skills Repo

이 repo는 내가 자주 쓰는 AI 에이전트용 스킬을 모아두는 개인 스킬 카탈로그다.

핵심 목표는 특정 에이전트 전용 스킬 저장소를 만드는 것이 아니다. 내가 실제로 자주 쓰는 작업 방식을 `SKILL.md`라는 source instruction으로 정리하고, Codex, Claude, 또는 다른 에이전트가 각 프로젝트의 instruction 파일에서 필요한 스킬만 골라 읽도록 만드는 것이다.

## 핵심 원칙

- 이 repo는 에이전트 공용 스킬의 source of truth다.
- 스킬은 전역 설치보다 프로젝트별 명시 연결을 기본으로 한다.
- 프로젝트마다 필요한 스킬만 해당 에이전트의 instruction 파일에 연결한다.
  - Codex: 보통 `AGENTS.md`
  - Claude: 보통 `CLAUDE.md`
  - 기타 에이전트: 그 에이전트가 읽는 동등한 instruction 파일
- 이 repo의 커스텀 스킬이 어떤 작업을 커버한다면, 그 작업에서는 각 에이전트의 기본/global 동작보다 이 repo의 스킬을 우선한다.
- 각 스킬은 작고, 명확하고, 내 취향에 맞게 수정하기 쉬워야 한다.
- 긴 취향, 세부 규칙, 평가 prompt, 예시는 `SKILL.md`를 부풀리지 말고 `references/`에 둔다.

## 스킬 포맷

각 스킬 폴더는 다음 한 쌍을 기본으로 가진다.

```text
skills/skill-name/
├── SKILL.md
└── skill.html
```

`SKILL.md`는 에이전트가 읽는 source instruction이다. 특정 런타임에 자동 등록되는 파일이라는 뜻이 아니라, 프로젝트 instruction 파일에서 경로와 trigger를 명시해 불러 쓰는 원본 지시문이다.

`skill.html`은 사람이 빠르게 판단하기 위한 시각 가이드다. 스킬을 프로젝트에 붙이기 전에 목적, trigger, workflow, 파일 구조를 한눈에 확인하는 용도다.

## 생명주기와 History

스킬은 한 번 만들고 끝나는 파일이 아니라 `draft -> active -> critical -> deprecated -> archived` 같은 생명주기를 가진다.

- `docs/skill-lifecycle.md`: 상태 정의, 승격/폐기 기준, review cadence를 둔다.
- `history/skills.md`: 확정된 상태 변경과 큰 변경만 기록하는 ledger다.
- `inspector/`: 아직 해결되지 않은 local-only 검사 메모만 둔다.
- `archive/`: 더 이상 새 프로젝트에 권장하지 않는 archived skill을 보관하는 위치다.

작은 오탈자나 색상 조정은 history에 남기지 않는다. trigger, workflow, validator, snippet, 생명주기 상태가 바뀌는 변경만 기록한다.

## 현재 스킬

- `web-research`: 출처 우선 웹 리서치 스킬. research budget routing, query fan-out, source ledger, evidence scoring, stop rules, 한국어 친화적이고 간결한 출력 기준을 포함한다.
  - Source instruction: `skills/web-research/SKILL.md`
  - Human visual guide: `skills/web-research/skill.html`
- `skill-to-html`: `SKILL.md` 옆에 사람이 한눈에 이해할 수 있는 diagram-rich `skill.html`을 만들거나 고치는 스킬.
  - Source instruction: `skills/skill-to-html/SKILL.md`
  - Human visual guide: `skills/skill-to-html/skill.html`
- `karpathy-thinkings`: Karpathy식 코딩 에이전트 사고를 적용해 추측, 과설계, 주변 리팩터링, 약한 검증을 줄이는 구현 스킬.
  - Source instruction: `skills/karpathy-thinkings/SKILL.md`
  - Human visual guide: `skills/karpathy-thinkings/skill.html`
- `skill-update`: 기존 공유 스킬을 수정할 때 `SKILL.md`, references, validator, `skill.html`, snippets, docs, history를 함께 맞추는 유지보수 스킬.
  - Source instruction: `skills/skill-update/SKILL.md`
  - Human visual guide: `skills/skill-update/skill.html`
- `atomic-committer`: dirty git tree를 atomic commit 단위로 나누고, 영어 conventional prefix와 한글 요약으로 커밋하는 스킬.
  - Source instruction: `skills/atomic-committer/SKILL.md`
  - Human visual guide: `skills/atomic-committer/skill.html`
- `project-structure`: frontend, backend, full-stack monorepo, desktop app의 폴더 구조와 기본 stack/env/codegen 정책, backend logger/cache/security/observability, Redis DB boundary, Drizzle migration, test surface를 일관되게 잡는 스킬.
  - Source instruction: `skills/project-structure/SKILL.md`
  - Human visual guide: `skills/project-structure/skill.html`
- `sync-docs`: README, AGENTS, docs, snippets, history, skill 파일을 서로 비교해 stale 설명, 누락된 연결, 충돌하는 규칙을 정리하는 문서 최신화 스킬.
  - Source instruction: `skills/sync-docs/SKILL.md`
  - Human visual guide: `skills/sync-docs/skill.html`

## 에이전트 연결 방식

이 repo의 스킬은 각 에이전트의 project instruction 파일에서 연결한다.

Codex 프로젝트 예시:

```markdown
## Project Skills

- Use $web-research at <skills-root>/skills/web-research/SKILL.md when a task needs current facts, web verification, source comparison, citations, recommendations, product research, laws, regulations, technical documentation lookup, or structured search beyond simple keywords.
```

Claude 프로젝트 예시:

```markdown
## Project Skills

- For current facts, source verification, recommendations, product research, laws, regulations, technical documentation lookup, or structured search beyond simple keywords, use the shared skill at `<skills-root>/skills/web-research/SKILL.md`.
```

`<skills-root>`는 이 repo를 clone한 실제 위치로 바꾼다. 컴퓨터를 바꾸면 새 컴퓨터에서 이 repo를 clone한 경로만 다시 지정하면 된다. `<codex-home>`은 보통 `$HOME/.codex`이고, `CODEX_HOME`을 따로 설정했다면 그 값을 쓴다.

새 컴퓨터에서 쓰는 기본 흐름:

```bash
cd /path/to/skills
export SKILLS_ROOT="$PWD"
```

프로젝트 instruction 파일에 snippet을 붙일 때 `<skills-root>`를 `$SKILLS_ROOT` 값 또는 실제 clone 경로로 치환한다. repo 내부 validator는 repo root에서 상대경로로 실행한다.

에이전트별 adapter와 연결 예시는 `docs/agent-compatibility.md`를 본다.

## 프로젝트 셋업 흐름

새 프로젝트를 시작하거나 기존 프로젝트에 스킬을 붙일 때는 이 repo를 카탈로그처럼 사용한다.

1. 이 README에서 사용 가능한 스킬을 확인한다.
2. 후보 스킬의 `skill.html`을 열어 빠르게 훑는다.
3. 해당 프로젝트에 필요한 스킬만 고른다.
4. `project-snippets/`의 맞는 snippet을 프로젝트의 instruction 파일에 추가한다.
5. 프로젝트만의 예외나 취향은 snippet 아래에 override로 적는다.
6. 특정 프로젝트에서만 완전히 다른 동작이 필요할 때만 스킬을 fork한다.
7. 오래 쓰지 않거나 대체된 스킬은 `history/skills.md`에서 deprecated 또는 archived로 표시한다.

자세한 흐름은 `docs/project-skill-setup.md`를 본다.

## Skill HTML 원칙

`skill.html`은 단순히 `SKILL.md`를 카드로 나눈 문서가 아니어야 한다. 스킬의 쓰임을 한눈에 알아볼 수 있도록 다음 같은 시각 구조를 적극적으로 사용한다.

- 언제 쓰고 언제 건너뛸지 보여주는 decision matrix
- 스킬이 어떤 순서로 작동하는지 보여주는 workflow flowchart
- 중요한 기준, 출처, 위험도, 우선순위를 보여주는 chart
- `SKILL.md`, `references/`, `scripts/`, `assets/`, `project-snippets/`의 관계를 보여주는 resource map
- 사용자가 주는 입력과 스킬이 내는 출력을 보여주는 input/output schema
- 하면 되는 것과 하면 안 되는 것을 대비하는 do/don't matrix

`skill-to-html`을 사용할 때는 `skills/skill-to-html/references/visual-guide-standards.md`의 기준을 따른다. `skill.html`은 PC 데스크톱에서 빠르게 읽히는 정적인 HTML이어야 하며, 외부 CDN이나 빌드 도구에 의존하지 않는다.

## 생성과 검증

이 repo는 `skill-creator` 같은 Codex 시스템 스킬을 소유하지 않는다. 새 스킬 구조를 잡을 때는 외부 시스템 `skill-creator`를 참고할 수 있지만, repo가 소유하는 반복 검증 명령은 TypeScript validator로 둔다.

프로젝트에 기존 스킬을 연결하는 절차는 `docs/project-skill-setup.md`를 따른다. 새 스킬을 만들거나 기존 스킬을 크게 바꾸는 검증은 이 섹션과 `docs/skill-inspector.md`를 함께 따른다.

기존 스킬을 업데이트할 때는 `skill-update`를 사용해 source instruction, references, validator, visual guide, snippets, docs, history를 하나의 패키지로 맞춘다.

새 스킬을 만들거나 기존 스킬을 크게 바꿀 때의 기본 흐름:

```text
skill-creator 또는 SKILL.md 작성
-> skill-to-html로 skill.html 생성/갱신
-> project-snippets와 history 필요 여부 정리
-> sync-docs로 README/AGENTS/docs/snippets/history 정합성 확인
-> node scripts/validate-skill.ts skills/<skill-name>
-> 스킬별 validator 실행
-> node scripts/validate-skill-repo.ts .
-> docs/skill-inspector.md 기준으로 검사
```

시스템 `skill-creator` 위치:

```text
<codex-home>/skills/.system/skill-creator/SKILL.md
```

기본 validator:

```bash
node scripts/validate-skill.ts skills/<skill-name>
```

스킬별 static validator가 있으면 함께 돌린다.

```bash
node skills/web-research/scripts/validate-web-research.ts skills/web-research
node skills/skill-to-html/scripts/validate-skill-to-html.ts skills/skill-to-html
node skills/karpathy-thinkings/scripts/validate-karpathy-thinkings.ts skills/karpathy-thinkings
node skills/skill-update/scripts/validate-skill-update.ts skills/skill-update
node skills/atomic-committer/scripts/validate-atomic-committer.ts skills/atomic-committer
node skills/project-structure/scripts/validate-project-structure.ts skills/project-structure
node skills/sync-docs/scripts/validate-sync-docs.ts skills/sync-docs
```

repo 운영 기준과 문서 정합성도 함께 확인한다.

```bash
node scripts/validate-skill-repo.ts .
```

Repo가 소유하는 validator는 `.ts`를 기본으로 둔다. 이 repo는 Node 22 이상에서 `.ts` validator를 직접 실행하는 것을 기준으로 하며, 새 검증 스크립트를 `.py`로 추가하지 않는다. hook처럼 Codex나 다른 런타임의 호환성이 더 중요한 파일만 `.mjs` 예외를 유지한다. `scripts/validate-skill-repo.ts`는 각 스킬이 README, AGENTS, `project-snippets/`, `history/skills.md`, validator 명령에 같은 이름과 경로로 반영되어 있는지도 검사한다.

Codex에서는 `.codex/config.toml`의 hook이 `SKILL.md` 변경 후 stale `skill.html`을 감지하고, `codex exec`로 `skill-to-html`을 자동 실행해 인접 guide를 갱신한다. 자세한 내용은 `docs/codex-hooks.md`를 본다.

## 검사관 기준

스킬 검사 기준은 `docs/skill-inspector.md`에 둔다.

`inspector/` 폴더는 local-only 검사 메모와 미해결 이슈를 임시로 두는 곳이다. GitHub에는 `.gitkeep`만 올린다. 검사에서 수정할 항목이 나오면 먼저 `inspector/YYYY-MM-DD-<scope>.md`에 findings, 근거 파일, 검증 명령, 해결 기준을 적고 그 문서를 기준으로 고친다. 처리 완료된 검사 파일은 삭제하고, 일부만 처리됐으면 해결된 항목을 제거해 미해결 항목만 남긴다.

## 유지보수

- `SKILL.md`에는 핵심 trigger와 workflow만 간결하게 둔다.
- 긴 설명, 평가 prompt, source rule, 개인 취향은 `references/`로 분리한다.
- 스킬을 만들거나, 설치하거나, fork하거나, 크게 수정하면 `skill-to-html`로 해당 스킬의 `skill.html`도 함께 만든다.
- 기존 스킬을 업데이트할 때는 `skill-update`로 관련 references, validator, snippet, docs, history까지 함께 맞춘다.
- 스킬을 크게 수정한 뒤에는 `docs/skill-inspector.md` 기준으로 검사한다.
- 문서 최신화, stale 설명, 문서 간 충돌 검토 요청은 `sync-docs`로 처리한다.
- repo가 소유하는 validator는 TypeScript로 작성하고 `node <path>.ts`로 실행한다.
- trigger, workflow, validator, snippet, 생명주기 상태가 바뀌면 `history/skills.md`를 업데이트한다.
- 미해결 이슈만 local-only `inspector/`에 남기고, 해결된 검사 파일은 삭제한다.
- 스킬을 추가하거나 이름을 바꾸면 `project-snippets/`도 같이 업데이트한다.
