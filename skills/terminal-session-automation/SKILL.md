---
name: terminal-session-automation
description: "cmux, Warp, agent terminal에서 Codex/Claude/OpenCode prompt pinning, tab title, session status, workspace board, terminal workflow, hook latency, 터미널별 CLI/escape-sequence 자동화를 설정하거나 디버그할 때 사용한다."
---

# 터미널 세션 자동화

이 스킬은 특정 터미널 하나에 묶이지 않고, 현재 terminal host가 제공하는 가장 안전한 표면으로 agent session ergonomics를 만든다. cmux에서는 CLI를 우선하고, Warp에서는 공식 문서의 shell title sequence, Warp workflows, launch configurations, Oz/agent 기능을 우선한다.

`references/hook-recipes.md`는 prompt pinning hook, tab title, cmux status, Warp title sequence, workflow/launch config를 구현하거나 수정할 때만 읽는다.

## 핵심 계약

- 먼저 host를 판별한다: cmux는 `CMUX_*` 환경 변수와 `cmux --help`, Warp는 `TERM_PROGRAM=WarpTerminal`, `/dev/tty`, Warp docs, `oz --help` availability를 본다.
- host별 기능을 섞어 추측하지 않는다. cmux `set-status`와 Warp tab title은 같은 기능이 아니다.
- hook 변경은 project-local로 유지하고, global setup은 사용자가 명시할 때만 한다.
- `UserPromptSubmit` hook은 빠르게 끝나야 한다. validator, `codex exec`, broad repo scan, network call을 prompt path에 넣지 않는다.
- prompt pinning은 사용자의 원문 prompt를 한 줄 whitespace normalization만 거쳐 보존한다.
- semantic title은 prompt hook이 아니라 agent가 turn 시작 후 명시적으로 쓴 opt-in output으로 다룬다.
- cmux가 없거나 Warp title output이 불가능하면 조용히 degrade한다.
- socket auth, pane text 전송, surface close, history clear, global hook, destructive workspace action은 사용자 확인을 받는다.

## adapter 기준

| host | 우선 표면 | 대체 |
| --- | --- | --- |
| cmux | `cmux rename-tab --surface`, `cmux set-status`, `cmux markdown open`, `cmux feed` | `cmux identify`, workspace-scoped targeting |
| Warp | OSC tab title sequence, `.warp/workflows`, launch configuration YAML, `oz` CLI | local note file, desktop notification, manual command palette step |
| generic terminal | shell prompt/title escape, local workflow notes | no-op with clear report |

## common jobs 기준

- submitted prompt를 current tab title에 pinning
- cmux `current-question` status에 원문 prompt 보존
- Warp tab title을 OSC sequence로 갱신하고, 필요하면 `.warp/workflows` 또는 launch config를 작성
- session board, workflow note, launch configuration 작성
- hook latency와 payload shape 조사
- Warp/Oz agent entrypoint, third-party CLI agent utility bar, notification behavior 문서화

## prompt pinning pattern 기준

원문 prompt를 요약하지 않는다. filler word를 제거하거나 rule-map으로 바꾸지 않는다. hook label을 semantic summary라고 부르지 않는다.

1. project-local Codex `UserPromptSubmit` hook을 추가하거나 갱신한다.
2. `scripts/pin-prompt-title.mjs`를 사용한다.
3. payload에서 원문 prompt를 추출하고 한 줄로만 정규화한다.
4. cmux면 `CMUX_SURFACE_ID`를 우선해 `cmux rename-tab`과 `cmux set-status current-question`을 호출한다.
5. Warp면 `/dev/tty`에 OSC title sequence를 쓰고, 필요하면 사용자가 shell rc에 `export WARP_DISABLE_AUTO_TITLE=true`를 둘 수 있다고 안내한다.
6. 둘 다 아니거나 표면이 없으면 성공 종료한다.

## semantic title pattern 기준

agent가 별도로 의미 있는 title을 만들 때는 prompt pinning과 분리한다. semantic title은 agent output이고, prompt pinning은 user input 보존이다.

- cmux: `cmux rename-tab --surface "$CMUX_SURFACE_ID" "<agent-written title>"`
- Warp: `printf '\033]0;%s\007' "<agent-written title>" > /dev/tty`

이 pattern은 사용자가 짧은 의미 제목을 명시했을 때만 쓴다.

## ask before changing 기준

- hook 설치 또는 제거
- global terminal, cmux, Warp, Oz 설정 변경
- socket auth 변경
- pane에 text 또는 keypress 전송
- surface, tab, pane, workspace 종료
- history, logs, launch config 삭제
- agent 권한, MCP, cloud runner, self-hosted runner 설정 변경

## 검증 기준

```bash
node scripts/validate-skill.ts skills/terminal-session-automation
node skills/terminal-session-automation/scripts/validate-terminal-session-automation.ts skills/terminal-session-automation
node scripts/validate-skill-html.ts .
node scripts/validate-skill-repo.ts .
```

실제 hook 구현은 dry-run payload로 먼저 검증한다.

```bash
TERMINAL_SESSION_PROMPT_DRY_RUN=1 node skills/terminal-session-automation/scripts/pin-prompt-title.mjs < sample-payload.json
```
