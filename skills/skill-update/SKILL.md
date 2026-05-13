---
name: skill-update
description: "기존 shared skill을 업데이트, 수정, 개선, 유지보수, rename, split, deprecate, archive할 때 사용한다."
---

# 스킬 업데이트

이 스킬은 기존 스킬을 바꿀 때 `SKILL.md`, references, validators, `agents/openai.yaml`, `skill.html`, snippets, docs, history를 하나의 package로 맞춘다.

## 핵심 계약

- 사용자가 의도한 behavior change에서 시작한다.
- 기존 유용한 behavior는 요청 없이 제거하지 않는다.
- `SKILL.md`는 concise하고 trigger-focused로 유지한다.
- 긴 예시, 취향, source rule은 `references/`로 옮긴다.
- material change가 있으면 `skill-to-html`도 실행한다.
- skill add/remove/rename/archive/restore가 있으면 show-skills HTML catalog를 갱신한다.
- 한국어 Markdown 규칙을 지켜 `skills/**/*.md`를 한국어 우선으로 유지한다.

## update scope 기준

| 변경 | follow-up |
| --- | --- |
| trigger/description | SKILL.md, snippet, README/AGENTS, metadata, HTML, history |
| workflow/rules | SKILL.md, references, validator, HTML, history |
| validator/script | README command, validator 실행, 필요 시 history |
| rename/split/archive | 경로 전체 갱신, catalog, lifecycle, history |

## workflow

1. 대상 skill과 결과를 확인한다.
2. 현재 skill folder, snippets, README, AGENTS, history를 본다.
3. 필요한 reference만 읽는다.
4. 최소 파일을 수정한다.
5. material change면 `skill-to-html`을 실행한다.
6. `docs/skill-inspector.md` 기준으로 검사한다.
7. validator를 실행하고 결과를 보고한다.

## ask before changing 기준

trigger 의미 변경, behavior 제거, rename/split/archive, repo-wide preference 변경, source-of-truth conflict는 사용자에게 묻는다.
