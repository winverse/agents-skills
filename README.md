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
skill-name/
├── SKILL.md
└── skill.html
```

`SKILL.md`는 에이전트가 읽는 source instruction이다. 특정 런타임에 자동 등록되는 파일이라는 뜻이 아니라, 프로젝트 instruction 파일에서 경로와 trigger를 명시해 불러 쓰는 원본 지시문이다.

`skill.html`은 사람이 빠르게 판단하기 위한 시각 가이드다. 스킬을 프로젝트에 붙이기 전에 목적, trigger, workflow, 파일 구조를 한눈에 확인하는 용도다.

## 현재 스킬

- `web-research`: 출처 우선 웹 리서치 스킬. research budget routing, query fan-out, source ledger, evidence scoring, stop rules, 한국어 친화적이고 간결한 출력 기준을 포함한다.
  - Source instruction: `web-research/SKILL.md`
  - Human visual guide: `web-research/skill.html`
- `skill-to-html`: `SKILL.md` 옆에 사람이 한눈에 이해할 수 있는 diagram-rich `skill.html`을 만들거나 고치는 스킬.
  - Source instruction: `skill-to-html/SKILL.md`
  - Human visual guide: `skill-to-html/skill.html`

## 에이전트 연결 방식

이 repo의 스킬은 각 에이전트의 project instruction 파일에서 연결한다.

Codex 프로젝트 예시:

```markdown
## Project Skills

- Use [$web-research](/Users/winverse/Desktop/skills/web-research/SKILL.md) when a task needs current facts, web verification, source comparison, citations, recommendations, product research, laws, regulations, technical documentation lookup, or structured search beyond simple keywords.
```

Claude 프로젝트 예시:

```markdown
## Project Skills

- For current facts, source verification, recommendations, product research, laws, regulations, technical documentation lookup, or structured search beyond simple keywords, use the shared skill at `/Users/winverse/Desktop/skills/web-research/SKILL.md`.
```

에이전트별 adapter와 연결 예시는 `docs/agent-compatibility.md`를 본다.

## 프로젝트 셋업 흐름

새 프로젝트를 시작하거나 기존 프로젝트에 스킬을 붙일 때는 이 repo를 카탈로그처럼 사용한다.

1. 이 README에서 사용 가능한 스킬을 확인한다.
2. 후보 스킬의 `skill.html`을 열어 빠르게 훑는다.
3. 해당 프로젝트에 필요한 스킬만 고른다.
4. `project-snippets/`의 맞는 snippet을 프로젝트의 instruction 파일에 추가한다.
5. 프로젝트만의 예외나 취향은 snippet 아래에 override로 적는다.
6. 특정 프로젝트에서만 완전히 다른 동작이 필요할 때만 스킬을 fork한다.

자세한 흐름은 `docs/project-skill-setup.md`를 본다.

## Skill HTML 원칙

`skill.html`은 단순히 `SKILL.md`를 카드로 나눈 문서가 아니어야 한다. 스킬의 쓰임을 한눈에 알아볼 수 있도록 다음 같은 시각 구조를 적극적으로 사용한다.

- 언제 쓰고 언제 건너뛸지 보여주는 decision matrix
- 스킬이 어떤 순서로 작동하는지 보여주는 workflow flowchart
- 중요한 기준, 출처, 위험도, 우선순위를 보여주는 chart
- `SKILL.md`, `references/`, `scripts/`, `assets/`, `project-snippets/`의 관계를 보여주는 resource map
- 사용자가 주는 입력과 스킬이 내는 출력을 보여주는 input/output schema
- 하면 되는 것과 하면 안 되는 것을 대비하는 do/don't matrix

`skill-to-html`을 사용할 때는 `skill-to-html/references/visual-guide-standards.md`의 기준을 따른다. `skill.html`은 PC 데스크톱에서 빠르게 읽히는 정적인 HTML이어야 하며, 외부 CDN이나 빌드 도구에 의존하지 않는다.

## 생성과 검증

이 repo는 `skill-creator` 같은 Codex 시스템 스킬을 소유하지 않는다. 다만 현재 스킬 생성과 기본 검증에는 Codex의 시스템 `skill-creator`를 도구로 사용한다.

새 스킬을 만들 때의 기본 흐름:

```text
system skill-creator -> repo skill-to-html -> project snippet -> inspector check
```

시스템 `skill-creator` 위치:

```text
/Users/winverse/.codex/skills/.system/skill-creator/SKILL.md
```

기본 validator:

```bash
PYTHONPATH=/private/tmp/codex-pyyaml python3 /Users/winverse/.codex/skills/.system/skill-creator/scripts/quick_validate.py /Users/winverse/Desktop/skills/<skill-name>
```

스킬별 static validator가 있으면 함께 돌린다.

```bash
node /Users/winverse/Desktop/skills/web-research/scripts/validate-web-research.mjs /Users/winverse/Desktop/skills/web-research
node /Users/winverse/Desktop/skills/skill-to-html/scripts/validate-skill-to-html.mjs /Users/winverse/Desktop/skills/skill-to-html
```

## 검사관 기준

스킬 검사 기준은 `docs/skill-inspector.md`에 둔다.

`inspector/` 폴더는 local-only 검사 메모와 미해결 이슈를 임시로 두는 곳이다. GitHub에는 `.gitkeep`만 올리고, 처리 완료된 검사 파일은 삭제해서 같은 검증 사항을 반복 검토하지 않게 한다.

## 유지보수

- `SKILL.md`에는 핵심 trigger와 workflow만 간결하게 둔다.
- 긴 설명, 평가 prompt, source rule, 개인 취향은 `references/`로 분리한다.
- 스킬을 만들거나, 설치하거나, fork하거나, 크게 수정하면 `skill-to-html`로 해당 스킬의 `skill.html`도 함께 만든다.
- 스킬을 크게 수정한 뒤에는 `docs/skill-inspector.md` 기준으로 검사한다.
- 미해결 이슈만 local-only `inspector/`에 남기고, 해결된 검사 파일은 삭제한다.
- 스킬을 추가하거나 이름을 바꾸면 `project-snippets/`도 같이 업데이트한다.
