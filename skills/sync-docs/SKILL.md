---
name: sync-docs
description: "README, docs, snippets, history, skill files, root/folder-local AGENTS index를 비교해 stale statement, missing cross-reference, source-of-truth conflict를 정리할 때 사용한다."
---

# 문서 동기화

이 스킬은 여러 문서가 같은 규칙을 다르게 말할 때 현재 repo 파일을 evidence로 삼아 정합성을 맞춘다.

## 핵심 계약

- 현재 repo 파일을 첫 evidence source로 본다.
- instruction link와 snippet이 바뀌면 target project setup도 검증한다.
- source of truth가 불명확한 rule은 사용자에게 묻는다.
- folder tree가 바뀌면 folder-local `AGENTS.md` index도 확인한다.
- 한국어 Markdown 규칙과 HTML 한국어 라벨 기준을 함께 본다.

## 확인할 것

- README와 AGENTS의 skill list
- `docs/skill-catalog.md`
- `project-snippets/*.md`
- `history/skills.md`
- skill `SKILL.md`, references, `skill.html`
- validator command와 실제 파일 경로

## source-of-truth heuristic 기준

실행 가능한 script와 current filesystem이 우선이다. 그 다음 root AGENTS, README, docs, snippet 순서로 확인한다. 사용자의 최근 명시 지시가 있으면 그 지시를 우선한다.

## output shape 기준

```text
정리한 drift
- <파일>: <변경>

검증
- <명령>: <결과>

남은 질문
- <있을 때만>
```
