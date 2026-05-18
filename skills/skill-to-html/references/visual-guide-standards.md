# skill.html 시각 가이드 기준

## local design system 기준

이 repo의 `skill.html`은 한국어 우선 copy, 조용한 운영 도구형 UI, 얕은 border, 명확한 diagram structure를 기본으로 한다.

## language policy 기준

화면 라벨은 한국어로 쓴다. `SKILL.md`, `GraphQL`, `TypeScript`, `Playwright`, command, file path처럼 코드 맥락의 고유어만 원문을 유지한다.

## required visual grammar 기준

- decision matrix
- workflow flow
- resource map
- input/output schema
- risk/guardrail chart

## page structure 기준

첫 화면에서 skill name, trigger, misuse guardrail이 보여야 한다. 이어서 workflow와 validation command가 보여야 한다.

## diagram rules 기준

diagram은 실제 의사결정에 쓰여야 한다. 텍스트를 박스로 쪼개기만 한 구조는 부족하다.

## render integrity 기준

- 검증 viewport는 PC desktop이다. mobile/tablet viewport는 확인하지 않아도 된다.
- SVG arrow는 출발 node와 도착 node가 시각적으로 분명해야 한다.
- `marker-end`가 있는 화살표는 실제 box, node, lane, 또는 명시된 목표에 닿아야 하며 빈 공간을 가리키지 않는다.
- 넓은 scope table, matrix, checklist table은 full-width section에 둔다.
- 2열 layout에는 짧은 card, schema, file map처럼 폭이 안정적인 구조만 넣는다.
- PC desktop viewport에서 section header, table cell, SVG text, code path가 부모 밖으로 밀리거나 잘리지 않아야 한다.
- mobile/tablet breakpoint, 1열 접힘, touch target, small viewport wrapping은 이 스킬의 완료 조건이 아니다.
