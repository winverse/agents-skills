# Codex Hooks

이 repo는 Codex hook으로 `SKILL.md`와 `skill.html`의 동기화를 감시한다.

## 목적

스킬을 생성하거나 수정하면 에이전트용 source instruction인 `SKILL.md`만 바뀌기 쉽다. 이 repo에서는 사람이 빠르게 판단하는 `skill.html`도 같은 시점에 갱신되어야 하므로 Codex `PostToolUse` hook으로 누락을 감지한다.

## 설정 파일

```text
.codex/config.toml
.codex/hooks/ensure_skill_html.mjs
```

`.codex/config.toml`은 Codex hooks를 켜고, 파일 편집 계열 tool 사용 후 hook script를 실행한다.

```toml
[features]
hooks = true

[[hooks.PostToolUse]]
matcher = "^apply_patch$|^functions.apply_patch$|^Edit$|^Write$|^Bash$|^exec_command$|^functions.exec_command$"

[[hooks.PostToolUse.hooks]]
type = "command"
command = 'node "$(git rev-parse --show-toplevel)/.codex/hooks/ensure_skill_html.mjs"'
timeout = 10
statusMessage = "Checking skill HTML guide"

[[hooks.UserPromptSubmit]]

[[hooks.UserPromptSubmit.hooks]]
type = "command"
command = 'node "$(git rev-parse --show-toplevel)/.codex/hooks/ensure_skill_html.mjs"'
timeout = 10
statusMessage = "Checking pending skill HTML guide"
```

## 최초 실행 승인

Codex는 repo-local hook을 처음 실행하기 전에 수동 review를 요구한다.

```text
2 hooks need review before they can run. Open /hooks to review them.
```

이 메시지는 정상이다. 현재 이 repo는 같은 script를 두 이벤트에 연결한다.

- `PostToolUse`: 파일 편집/명령 실행 직후 `SKILL.md` 변경을 확인한다.
- `UserPromptSubmit`: 이전 tool hook이 놓친 상태를 다음 사용자 입력 시 다시 확인한다.

Codex에서 `/hooks`를 열고 두 hook의 command를 확인한 뒤 승인하면 실행된다. 승인 정보는 hook command와 설정 내용의 hash 기준으로 저장되므로, `.codex/config.toml`이나 hook script를 수정하면 다시 review가 필요할 수 있다.

## 동작

hook은 tool 실행 후 git 작업 트리와 hook payload를 확인한다.

- `*/SKILL.md`가 생성되거나 수정된 흔적을 찾는다.
- 같은 폴더의 `skill.html`이 dirty 상태면 이미 갱신 중이라고 보고 통과한다.
- `skill.html`이 없거나 변경되지 않았으면 Codex 대화에 추가 context를 주입한다.
- 추가 context는 `skill-to-html/SKILL.md`를 사용해서 해당 스킬 폴더의 `skill.html`을 갱신하라고 지시한다.
- `PostToolUse`에서 놓친 경우를 줄이기 위해 `UserPromptSubmit`에서도 한 번 더 검사한다.

## 한계

Codex hook은 에이전트 스킬을 모델 내부에서 직접 호출하는 API가 아니다. 따라서 hook이 `skill-to-html`을 강제로 실행하지는 않고, Codex에게 다음 단계로 수행해야 할 mandatory context를 주입한다.

또한 Codex는 project-local `.codex/config.toml`을 세션 시작 시점에 읽는 경우가 많다. 이 파일을 방금 추가하거나 수정했다면 현재 대화에서는 바로 적용되지 않을 수 있고, 새 Codex 세션 또는 프로젝트 재오픈 후 안정적으로 동작한다.

실제 차단까지 필요하면 같은 hook에서 `decision = "block"` 형태로 바꾸는 별도 정책을 추가한다. 지금은 작업 흐름을 끊지 않기 위해 reminder 방식으로 둔다.
