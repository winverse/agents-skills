---
name: cmux-automation
description: "cmux hook, Codex/Claude/OpenCode integration, prompt-to-tab/status pinning, workspace/tab/pane/status automation, feed workflow, browser surface, cmux CLI 세션 ergonomics를 자동화하거나 디버그할 때 사용한다."
---

# cmux 자동화

이 스킬은 cmux CLI와 hook을 실제 환경에서 확인하며 설정한다. recipe만 제시하지 않고, 가능한 경우 local cmux output으로 동작 여부를 검증한다.

## 핵심 계약

- local cmux CLI와 `cmux docs ...`를 먼저 확인한다.
- hook 변경은 project-local로 유지하고, global setup은 사용자가 명시할 때만 한다.
- `UserPromptSubmit` hook은 빠르게 끝나야 한다.
- prompt pinning은 사용자의 원문 prompt를 보존한다.
- socket auth, pane text 전송, surface close, history clear는 사용자 확인을 받는다.

## common jobs 기준

- prompt를 현재 tab title이나 status에 pinning
- `CMUX_SURFACE_ID` 기반 current surface targeting
- `cmux rename-tab --surface`, `cmux set-status` 사용
- session board나 feed workflow 작성
- hook latency와 payload shape 조사

## prompt pinning pattern 기준

원문 prompt를 요약하지 않는다. filler word를 제거하거나 rule-map으로 바꾸지 않는다. hook label을 semantic summary라고 부르지 않는다.

## semantic title pattern 기준

agent가 별도로 의미 있는 title을 만들 때는 prompt pinning과 분리한다. semantic title은 agent output이고, prompt pinning은 user input 보존이다.

## ask before changing 기준

- hook 설치 또는 제거
- socket auth 변경
- pane에 text 전송
- surface 종료
- history 삭제
