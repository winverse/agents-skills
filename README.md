# Skills Repo

이 repo는 내가 자주 쓰는 Codex 스킬들을 정리하고, 내 기준에 맞게 커스텀해서 프로젝트별로 골라 쓰기 위한 스킬 카탈로그다.

목표는 기본/global 스킬을 무조건 따르는 것이 아니라, 내가 실제로 많이 쓰는 작업 흐름을 더 작고 엄격한 스킬로 정리한 뒤 각 프로젝트의 `AGENTS.md`에서 필요한 것만 연결해 사용하는 것이다.

## 운영 원칙

- 이 repo의 스킬을 기본값처럼 `~/.codex/skills`에 설치하거나 symlink하지 않는다.
- 이 repo는 자동 전역 스킬 디렉터리가 아니라, 수동으로 고르는 스킬 카탈로그다.
- 프로젝트마다 필요한 스킬만 해당 프로젝트의 `AGENTS.md`에 링크해서 사용한다.
- 이 repo의 커스텀 스킬이 어떤 작업을 커버한다면, 그 작업에서는 기본/global Codex 스킬보다 커스텀 스킬을 우선한다.
- 각 스킬은 작고, 명확하고, 내 취향에 맞게 수정하기 쉬워야 한다.
- 긴 취향, 세부 규칙, 예시, 참고 자료는 `SKILL.md`를 부풀리지 말고 각 스킬의 `references/`에 둔다.

## 현재 스킬

- `web-research`: 출처 우선 웹 리서치 스킬. agentic search, source ledger, evidence scoring, 한국어 친화적이고 간결한 출력 기준을 포함한다.
  - Codex용 지시문: `web-research/SKILL.md`
  - 사람이 빠르게 보는 시각 가이드: `web-research/skill.html`
- `skill-to-html`: `SKILL.md` 옆에 사람이 한눈에 이해할 수 있는 diagram-rich `skill.html`을 만들거나 고치는 스킬.
  - Codex용 지시문: `skill-to-html/SKILL.md`
  - 사람이 빠르게 보는 시각 가이드: `skill-to-html/skill.html`

## 시스템 스킬 의존성

이 repo는 `skill-creator` 같은 Codex 시스템 스킬을 소유하지 않는다.

새 스킬을 만들 때는 먼저 설치된 시스템 스킬을 사용한다.

```text
/Users/winverse/.codex/skills/.system/skill-creator/SKILL.md
```

그 다음 이 repo의 커스텀 `skill-to-html` 스킬을 사용해서 사람용 `skill.html`을 만든다.

```text
/Users/winverse/Desktop/skills/skill-to-html/SKILL.md
```

기본 생성 흐름은 다음과 같다.

```text
system skill-creator -> repo skill-to-html -> project snippet
```

## Skill HTML 원칙

각 스킬 폴더는 반드시 다음 한 쌍을 가져야 한다.

```text
skill-name/
├── SKILL.md
└── skill.html
```

`SKILL.md`는 Codex가 읽는 실행 지시문이고, `skill.html`은 내가 스킬을 설치하거나 프로젝트에 연결할 때 빠르게 판단하기 위한 사람용 시각 가이드다.

`skill.html`은 단순히 `SKILL.md`를 카드로 나눈 문서가 아니어야 한다. 스킬의 쓰임을 한눈에 알아볼 수 있도록 다음 같은 시각 구조를 적극적으로 사용한다.

- 언제 쓰고 언제 건너뛸지 보여주는 decision matrix
- 스킬이 어떤 순서로 작동하는지 보여주는 workflow flowchart
- 중요한 기준, 출처, 위험도, 우선순위를 보여주는 chart
- `SKILL.md`, `references/`, `scripts/`, `assets/`, `project-snippets/`의 관계를 보여주는 resource map
- 사용자가 주는 입력과 스킬이 내는 출력을 보여주는 input/output schema
- 하면 되는 것과 하면 안 되는 것을 대비하는 do/don't matrix

`skill-to-html`을 사용할 때는 `skill-to-html/references/visual-guide-standards.md`의 기준을 따른다. 특히 `skill.html`은 PC 데스크톱에서 빠르게 읽히는 정적인 HTML이어야 하며, 외부 CDN이나 빌드 도구에 의존하지 않는다.

## 프로젝트 연결 방식

새 프로젝트를 시작하거나 기존 프로젝트에 스킬을 붙일 때는 이 repo를 카탈로그처럼 사용한다.

1. 이 README에서 사용 가능한 스킬을 확인한다.
2. 후보 스킬의 `skill.html`을 열어 빠르게 훑는다.
3. 해당 프로젝트에 필요한 스킬만 고른다.
4. `project-snippets/`의 맞는 snippet을 프로젝트의 `AGENTS.md`에 추가한다.
5. 프로젝트만의 예외나 취향은 snippet 아래에 별도 override로 적는다.
6. 특정 프로젝트에서만 완전히 다른 동작이 필요할 때만 스킬을 fork한다.

최소 프로젝트 블록 예시는 다음과 같다.

```markdown
## Project Skills

- Use [$web-research](/Users/winverse/Desktop/skills/web-research/SKILL.md) when a task needs current facts, web verification, source comparison, citations, recommendations, product research, laws, regulations, or technical documentation lookup.
```

자세한 흐름은 `docs/project-skill-setup.md`를 본다.

## 유지보수

- `SKILL.md`에는 핵심 trigger와 workflow만 간결하게 둔다.
- 새 스킬 생성이나 구조 검증에는 시스템 `skill-creator`를 사용한다.
- 스킬을 만들거나, 설치하거나, fork하거나, 크게 수정하면 `skill-to-html`로 해당 스킬의 `skill.html`도 함께 만든다.
- `skill.html`은 diagram, chart, matrix, map, flow 중심으로 구성한다.
- 개인 취향과 긴 설명은 `references/preferences.md` 같은 reference 파일로 분리한다.
- 스킬을 추가하거나 이름을 바꾸면 `project-snippets/`도 같이 업데이트한다.
- 스킬을 수정한 뒤에는 validator로 확인한다.

```bash
PYTHONPATH=/private/tmp/codex-pyyaml python3 /Users/winverse/.codex/skills/.system/skill-creator/scripts/quick_validate.py /Users/winverse/Desktop/skills/web-research
```
