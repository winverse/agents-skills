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

Goal: after a Codex prompt is submitted, show a short version in the cmux tab and a longer version in the cmux status area.

Recommended trigger:

```toml
[[hooks.UserPromptSubmit.hooks]]
type = "command"
command = 'node "<repo-root>/.codex/hooks/cmux_pin_prompt.mjs"'
timeout = 5
statusMessage = "Pinning question to cmux"
```

Hook script shape:

```js
#!/usr/bin/env node
import { execFileSync } from "node:child_process";

let input = "";
for await (const chunk of process.stdin) input += chunk;

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
const title = `Q: ${oneLine.slice(0, 48)}`;

try {
  execFileSync("cmux", ["rename-tab", title], { stdio: "ignore" });
  execFileSync(
    "cmux",
    [
      "set-status",
      "current-question",
      oneLine.slice(0, 140),
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
- Keep UI helper hooks non-blocking.
- Ask before commands that send text to panes, clear history, close surfaces, or change global settings.
- Prefer `rename-tab`, `set-status`, and `markdown open` before stronger automation.
