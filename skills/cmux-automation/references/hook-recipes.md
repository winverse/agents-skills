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

Goal: after a Codex prompt is submitted, show a short rule-based task label in the cmux tab and preserve the user's original prompt text in the status area. Normalize whitespace for one-line display. The tab should stay short because cmux truncates narrow tab labels.

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

function summarizeWithFastRules(text) {
  if (/요약.*그대로|그대로.*요약|질문한\s*내용\s*그대로/u.test(text)) {
    return "요약 규칙 수정";
  }
  if (/(탭|tab).*(길이|폭|가로|ellipsis|말줄임)|가로.*탭/u.test(text)) {
    return "탭 폭 확인";
  }
  if (/(탭|tab).*(안.?바뀌|왜|이름)|이름.*안.?바뀌/u.test(text)) {
    return "탭 변경 디버그";
  }
  return text.split(/[?!.,。！？]/u)[0];
}

const oneLine = prompt.replace(/\s+/g, " ").trim();
const taskLabel = summarizeWithFastRules(oneLine).slice(0, 16);
const title = taskLabel;

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
      oneLine.slice(0, 500),
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
