# Cmux Hook Recipes

Use these recipes when implementing cmux-related automation.

## Discovery Commands

Start with local installed behavior:

```bash
command -v cmux
cmux --help
cmux docs agents
cmux docs settings
cmux docs api
cmux capabilities
```

Use docs output or printed raw documentation URLs only when needed. Prefer local CLI output for installed behavior.

## Prompt Pinning Recipe

Goal: after a Codex prompt is submitted, put the user's original prompt text directly in the cmux tab and mirror it in the status area. Normalize whitespace for one-line display only. Do not summarize, rule-map, strip filler words, or truncate the tab title by default; cmux may visually shorten narrow tabs, but hover can reveal the full title.

This hook does not produce a semantic summary. `UserPromptSubmit` runs before the agent has reasoned about the prompt. If the user explicitly wants a shorter or semantic tab title, use the two-stage pattern: hook writes the original prompt, then the agent updates the tab title after it understands the task.

## Agent Semantic Title Recipe

When the agent has read the prompt and can name the task better than the hook:

```bash
cmux rename-tab --surface "$CMUX_SURFACE_ID" "hook 요약 구조 검토"
cmux set-status current-question "원래 질문을 tab/status에 넣고, 명시 요청 때만 짧은 제목으로 덮어쓰기" \
  --workspace "$CMUX_WORKSPACE_ID" \
  --icon pin \
  --color "#2563eb"
```

Use this from the agent turn, not from `UserPromptSubmit`. Do not call nested `codex exec`, validators, or web research from the prompt-submit hook just to create a nicer title.

Use the bundled script as the source implementation:

```text
skills/cmux-automation/scripts/cmux-pin-prompt.mjs
```

Recommended trigger:

```toml
[[hooks.UserPromptSubmit.hooks]]
type = "command"
command = 'node "<repo-root>/.codex/hooks/cmux_pin_prompt.mjs"'
timeout = 5
statusMessage = "Pinning question to cmux"
```

Use `CMUX_PIN_PROMPT_SCOPE=workspace` only when Codex receives the prompt in one cmux surface but tool commands run in another surface and you intentionally want every related terminal tab in the workspace to receive the same prompt title. The default hook should update only the current surface for lower latency.

The project-local hook file can be a tiny wrapper when the project contains this skill:

```js
#!/usr/bin/env node
import "../../skills/cmux-automation/scripts/cmux-pin-prompt.mjs";
```

Or copy the bundled script into `.codex/hooks/cmux_pin_prompt.mjs` when the target project only links to this shared skills repo and needs a self-contained hook.

Core hook script shape:

```js
#!/usr/bin/env node
import { execFileSync } from "node:child_process";

let input = "";
if (process.env.CMUX_PROMPT_PAYLOAD_B64) {
  input = Buffer.from(process.env.CMUX_PROMPT_PAYLOAD_B64, "base64").toString("utf8");
} else {
  for await (const chunk of process.stdin) input += chunk;
}

let payload = {};
try {
  payload = JSON.parse(input || "{}");
} catch {
  process.exit(0);
}

const prompt =
  payload.prompt ??
  payload.user_prompt ??
  payload.userPrompt ??
  payload.message ??
  "";

const inCmux =
  process.env.CMUX_WORKSPACE_ID ||
  process.env.CMUX_SURFACE_ID ||
  process.env.CMUX_TAB_ID;

if (!prompt.trim() || !inCmux) process.exit(0);

const oneLine = prompt.replace(/\s+/g, " ").trim();
const title = oneLine;

function currentTabArgs() {
  if (process.env.CMUX_SURFACE_ID) {
    return ["--surface", process.env.CMUX_SURFACE_ID];
  }

  try {
    const raw = execFileSync("cmux", ["identify"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    });
    const info = JSON.parse(raw);
    const tabRef = info?.caller?.tab_ref ?? info?.focused?.tab_ref;
    return tabRef ? ["--tab", tabRef] : [];
  } catch {
    return [];
  }
}

try {
  execFileSync("cmux", ["rename-tab", ...currentTabArgs(), title], { stdio: "ignore" });
  execFileSync(
    "cmux",
    [
      "set-status",
      "current-question",
      oneLine,
      "--icon",
      "pin",
      "--color",
      "#2563eb",
    ],
    { stdio: "ignore" },
  );
} catch {
  process.exit(0);
}
```

Dry-run title checks should not require a live cmux surface:

```bash
printf '{"prompt":"오케이 그리고 workflow 스킬을 만들어줘"}' \
  | CMUX_PIN_PROMPT_DRY_RUN=1 node skills/cmux-automation/scripts/cmux-pin-prompt.mjs
```

## Payload Discovery

If the Codex hook payload field is unknown, create a temporary project-local debug hook that writes only the payload keys, not the full prompt, to a local ignored file. Remove it after discovering the field.

Do not log user prompts permanently unless the user explicitly asks for a session board or prompt history.

## Session Board Recipe

For multi-agent work, use a markdown board instead of relying only on tab titles:

```bash
cmux markdown open .cmux/session-board.md --focus false
```

Suggested board shape:

```md
# Session Board

| ID | Pane | Question | Done When | Status |
| --- | --- | --- | --- | --- |
| A1 | left | <short question> | <success condition> | running |
```

Keep boards local to the project unless the user asks for a global workspace memory.

## Safety Rules

- Back up config files before editing cmux settings or Codex hook config.
- Never store socket passwords, tokens, or secrets in hook scripts.
- Keep UI helper hooks short. Do not run validators, `codex exec`, or broad repo scans from `UserPromptSubmit`.
- Ask before commands that send text to panes, clear history, close surfaces, or change global settings.
- Prefer `rename-tab`, `set-status`, and `markdown open` before stronger automation.
