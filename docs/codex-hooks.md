# Codex Hooks

이 repo는 Codex hook으로 `SKILL.md`와 `skill.html`의 동기화를 감시한다.

## 목적

스킬을 생성하거나 수정하면 에이전트용 source instruction인 `SKILL.md`만 바뀌기 쉽다. 이 repo에서는 사람이 빠르게 판단하는 `skill.html`도 같은 시점에 갱신되어야 하므로 Codex hook으로 누락을 감지하고 `skill-to-html`을 자동 실행한다. 또한 스킬 관련 변경이 있으면 repo validator와 스킬별 validator를 실행해서 완료 전 검증 실패를 대화에 알려준다.

## 설정 파일

```text
.codex/config.toml
.codex/hooks/ensure_skill_html.mjs
```

`.codex/config.toml`은 Codex hooks를 켜고, 파일 편집 계열 tool 사용 후 hook script를 실행한다. 현재 설정은 `--auto` 모드로 동작해서 stale `skill.html`이 있으면 별도 `codex exec` 프로세스로 `skill-to-html`을 수행하고, 스킬 관련 변경 뒤 검증 명령을 실행한다.

```toml
[features]
hooks = true

[[hooks.PostToolUse]]
matcher = "^apply_patch$|^functions.apply_patch$|^Edit$|^Write$|^Bash$|^exec_command$|^functions.exec_command$"

[[hooks.PostToolUse.hooks]]
type = "command"
command = 'node "$(git rev-parse --show-toplevel)/.codex/hooks/ensure_skill_html.mjs" --auto'
timeout = 300
statusMessage = "Auto-updating skill HTML and validating repo"

[[hooks.UserPromptSubmit]]

[[hooks.UserPromptSubmit.hooks]]
type = "command"
command = 'node "$(git rev-parse --show-toplevel)/.codex/hooks/ensure_skill_html.mjs" --auto'
timeout = 300
statusMessage = "Auto-updating pending skill HTML and validating repo"
```

## 최초 실행 승인

Codex는 repo-local hook을 처음 실행하기 전에 수동 review를 요구한다.

```text
2 hooks need review before they can run. Open /hooks to review them.
```

이 메시지는 정상이다. 현재 이 repo는 같은 script를 두 이벤트에 연결한다.

- `PostToolUse`: 파일 편집/명령 실행 직후 `SKILL.md` 변경을 확인하고 stale guide를 자동 갱신한 뒤 검증한다.
- `UserPromptSubmit`: 이전 tool hook이 놓친 상태를 다음 사용자 입력 시 다시 확인하고 자동 갱신한 뒤 검증한다.

Codex에서 `/hooks`를 열고 두 hook의 command를 확인한 뒤 승인하면 실행된다. 승인 정보는 hook command와 설정 내용의 hash 기준으로 저장되므로, `.codex/config.toml`이나 hook script를 수정하면 다시 review가 필요할 수 있다.

## 동작

hook은 tool 실행 후 git 작업 트리의 dirty 상태를 확인한다.

- `skills/<skill-name>/SKILL.md`가 생성되거나 수정된 흔적을 찾는다.
- 같은 폴더의 `skill.html`이 dirty 상태면 이미 갱신 중이라고 보고 통과한다.
- `skill.html`이 없거나 변경되지 않았으면 hook이 `codex exec`를 실행한다.
- nested Codex 실행은 `skills/skill-to-html/SKILL.md`를 사용해서 대상 스킬 폴더의 인접 `skill.html`만 갱신하라는 제한 prompt를 받는다.
- nested 실행에는 `features.hooks=false`와 `SKILL_HTML_HOOK_ACTIVE=1`을 적용해 hook 재귀를 막는다.
- 스킬 폴더, snippets, history, docs, repo validator, hook 설정 같은 검증 관련 파일이 dirty면 `node scripts/validate-skill.ts`, 변경된 스킬의 `scripts/validate-<skill>.ts`, `node scripts/validate-skill-repo.ts .`를 실행한다.
- repo validator는 현재 스킬 목록이 README, AGENTS, `project-snippets/`, `history/skills.md`, 스킬별 validator 명령에 일관되게 반영됐는지도 확인한다.
- 검증이 통과하면 조용히 끝난다. 검증이 실패하면 hook process는 실패시키지 않고 Codex 대화에 실패한 명령과 출력을 additional context로 주입한다.
- `PostToolUse`에서 놓친 경우를 줄이기 위해 `UserPromptSubmit`에서도 한 번 더 검사한다.

## 한계

Codex hook 자체가 에이전트 스킬을 모델 내부에서 직접 호출하는 API는 아니다. 이 repo는 그 한계를 우회하기 위해 hook script가 별도 `codex exec` 프로세스를 실행하게 한다. 그래서 자동 갱신은 가능하지만, 일반 shell hook보다 느리고 모델 실행 비용이 든다.

또한 Codex는 project-local `.codex/config.toml`을 세션 시작 시점에 읽는 경우가 많다. 이 파일을 방금 추가하거나 수정했다면 현재 대화에서는 바로 적용되지 않을 수 있고, 새 Codex 세션 또는 프로젝트 재오픈 후 안정적으로 동작한다.

`codex exec` 자동 실행이나 validator 실행이 실패하면 hook은 실패 context를 대화에 주입한다. 작업자는 `skill-to-html` 또는 실패한 validator를 수동으로 다시 실행해 고친 뒤 완료해야 한다.
