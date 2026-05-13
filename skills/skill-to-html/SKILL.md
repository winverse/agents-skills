---
name: skill-to-html
description: "SKILL.md 옆에 사람이 빠르게 이해할 수 있는 diagram-rich skill.html을 만들거나 갱신할 때 사용한다."
---

# 스킬 HTML 만들기

이 스킬은 agent-readable `SKILL.md`를 human-readable `skill.html`로 변환한다. 단순 카드 요약이 아니라 decision matrix, flowchart, chart, resource map, input/output schema처럼 한눈에 판단 가능한 구조를 만든다.

## required outcome 기준

- 각 skill folder에는 `SKILL.md`와 `skill.html`이 함께 있어야 한다.
- visible copy는 한국어 우선으로 작성한다.
- 외부 CDN, 외부 이미지, 외부 script, build tool에 의존하지 않는다.
- desktop에서 빠르게 읽히고 mobile에서도 text overflow가 없어야 한다.

## design contract 기준

- visual guide는 설명 문단보다 구조를 우선한다.
- 색상은 절제하고, nested card와 decorative orb를 피한다.
- code term, file path, command는 원문을 유지한다.

## creation workflow 기준

1. 대상 `SKILL.md`와 필요한 `references/`만 읽는다.
2. trigger, workflow, guardrail, output shape를 추출한다.
3. 최소 4개 이상의 visual structure를 설계한다.
4. `skill.html`을 self-contained static HTML로 작성한다.
5. `node scripts/validate-skill-html.ts .`를 실행한다.

## quality bar 기준

HTML만 봐도 이 스킬을 언제 쓰고 언제 쓰지 말아야 하는지 알 수 있어야 한다.
