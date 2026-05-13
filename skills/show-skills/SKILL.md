---
name: show-skills
description: "현재 repo의 스킬을 보고, 나열하고, 요약하고, 비교하거나 작업에 맞는 스킬을 고를 때 사용한다."
---

# 스킬 목록 보기

이 스킬은 설치된 global skill 목록이 아니라 현재 repo filesystem을 source of truth로 삼아 `skills/*/SKILL.md`를 읽는다.

## 핵심 계약

- 전역 설치나 symlink를 만들지 않는다.
- live list는 `node skills/show-skills/scripts/show-skills.ts`로 만든다.
- static human catalog는 `docs/skill-catalog.md`를 참고한다.
- `skills/show-skills/skill.html`의 catalog block은 `node skills/show-skills/scripts/update-html-catalog.ts skills/show-skills`로 갱신한다.

## 선택 기준

- 현재 사실, 출처, 추천은 `web-research`
- 기존 스킬 수정은 `skill-update`
- 문서 drift는 `sync-docs`
- commit/push는 `atomic-committer`
- 브라우저 증거는 `browser-qa`
- 코드 리뷰는 `code-review`
- UI 리뷰는 `design-review`

## output shape 기준

```text
총 <n>개 스킬

추천
- <skill>: <이유>

목록
- <skill>: <요약> (<path>)
```
