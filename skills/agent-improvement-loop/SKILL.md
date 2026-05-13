---
name: agent-improvement-loop
description: "남은 token/context budget을 안전하게 써서 스킬 호출성, validator, 문서 정합성, hook, eval, repo 품질을 개선할 때 사용한다."
---

# 에이전트 개선 루프

이 스킬은 남는 작업 예산을 무작정 쓰지 않고, repo 품질을 높이는 작은 개선 단위로 배분한다. chat-only 조언보다 durable artifact를 우선한다.

## 핵심 계약

- spend-down 실행 전에는 반드시 사용자에게 `남은 토큰을 최대한 사용해서 안전한 backlog를 처리할까요? (예/아니오)`라고 묻는다.
- 사용자가 예라고 답하면 작은 batch로 안전한 backlog를 처리한다.
- 사용자가 아니오라고 답하면 token budget을 ceiling으로 보고 한 lane씩 검토한다.
- 산출물은 docs, validators, tests, hooks, snippets, eval cases처럼 repo에 남는 형태를 우선한다.
- unrelated refactor나 위험한 자동화 변경은 범위 밖으로 둔다.
- 이 repo에서 `/goal`이라고 쓰면 Claude Code의 `/goal` 기능을 뜻한다. Claude Code에서 긴 backlog batch를 돌릴 때는 measurable end state, check evidence, constraints, turn/time bound가 있는 goal condition을 먼저 만든다. 다른 runtime에서는 같은 내용을 checklist로 사용한다.

## track 선택

| track | 사용 시점 | 대표 작업 |
| --- | --- | --- |
| skills repo track | 이 repo처럼 스킬 catalog와 validator가 중심일 때 | trigger 정리, HTML catalog, snippet, eval case |
| general repo track | 앱·라이브러리 repo 품질을 높일 때 | test gap, docs drift, local hook, CI check |

## 개선 lane

- 호출성: skill description, snippet, AGENTS link가 실제 prompt와 맞는지 본다.
- 검증: validator가 의미 있는 실패를 잡는지 확인한다.
- 정합성: README, docs, snippets, history, skill.html의 설명을 맞춘다.
- 품질: 작은 test, guardrail, hook, eval fixture를 추가한다.

## goal-safe backlog 기준

- 한 goal에는 하나의 measurable end state만 둔다.
- check evidence는 실행할 명령과 남길 artifact를 명시한다.
- constraints에는 user change 보존, global install 금지, secret/credential 노출 금지를 적는다.
- runaway를 막기 위해 최대 turn, 시간, 파일 수, backlog item 수 중 하나를 둔다.
- goal evaluator가 직접 도구를 쓰지 않는다고 보고, agent가 검증 결과를 출력하게 한다.

## 출력 형식

```text
선택한 track
- <skills repo/general repo>

처리한 backlog
- <작업>: <파일>

검증
- <명령>: <결과>
```
