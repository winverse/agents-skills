---
name: cmux-automation
description: Use when the user asks to automate, configure, debug, or document cmux workflows, especially cmux hooks, Codex/Claude/OpenCode integrations, prompt-to-tab or prompt-to-status pinning, workspace/tab/pane/status automation, feed workflows, browser surfaces, or cmux CLI-driven session ergonomics.
---

# Cmux Automation

Use this skill for cmux-related automation and integration work. It is the home for future cmux hook recipes, prompt pinning, workspace labeling, and cmux CLI workflows.

Load `references/hook-recipes.md` when implementing or modifying a hook script, Codex hook config, cmux status/tab automation, or a reusable cmux workflow.

## Core Contract

- Prefer the local cmux CLI and docs as the first source of truth: `cmux --help`, `cmux docs agents`, `cmux docs settings`, `cmux docs api`, and `cmux capabilities`.
- Detect cmux terminals with `CMUX_WORKSPACE_ID`, `CMUX_SURFACE_ID`, or `CMUX_TAB_ID` before calling cmux UI commands.
- For Codex prompt automation, use `UserPromptSubmit` when the desired behavior should run after the user submits a prompt.
- When the user asks to run, enable, install, or test prompt pinning, create or update the project-local hook script and hook config. Do not stop at a recipe.
- Keep prompt hooks fast. Do not run validators, `codex exec`, or broad repo scans from `UserPromptSubmit`; use direct `CMUX_SURFACE_ID`/`CMUX_WORKSPACE_ID` targeting first and reserve `cmux identify` for fallback discovery.
- Keep project-local hook changes project-local unless the user explicitly asks for global cmux or global Codex configuration changes.
- Back up existing cmux or agent config files before editing them.
- Use `cmux rename-tab`, `cmux set-status`, and `cmux markdown open` for lightweight session memory before building heavier tooling.
- Keep tab titles short because cmux truncates narrow tab labels. Store the compact prompt title in the tab and the original full prompt in `current-question` status.
- Fail quietly for ergonomics hooks when cmux is not available or the terminal is outside cmux.
- Ask before installing/uninstalling hooks, changing global cmux settings, editing socket auth, closing panes/workspaces, clearing history, or sending text into another pane.

## Common Jobs

| Job | Preferred cmux surface |
| --- | --- |
| Show the current user question in the tab header | `cmux rename-tab` with a compact prompt title |
| Keep the longer original question visible | `cmux set-status current-question ...` |
| Keep a multi-agent work board | `cmux markdown open <board.md>` |
| Route agent events into a queue | `cmux feed tui` or `cmux hooks feed` |
| Debug whether cmux is available | environment variables, `cmux identify`, `cmux capabilities` |
| Modify cmux settings | `cmux docs settings`, `cmux settings path`, backup first |

## Prompt Pinning Pattern

When the user wants each submitted question to appear in the current cmux tab:

1. Add or update a project-local Codex `UserPromptSubmit` hook.
2. Use the bundled `scripts/cmux-pin-prompt.mjs` as the implementation source. A project-local hook can be a tiny wrapper that imports this script, or it can copy the script when the target project needs a self-contained hook.
3. Parse the hook JSON from stdin.
4. Extract the submitted prompt from known payload fields, and log only temporary payload keys during discovery if the field name is unknown.
5. Normalize whitespace, derive a short tab title, and keep the user's original wording in `current-question` status. Do not lose the full prompt.
6. If `CMUX_SURFACE_ID` exists, target the current session with `cmux rename-tab --surface "$CMUX_SURFACE_ID" ...`; use `cmux identify` only as a fallback when the surface env var is missing. Raw `CMUX_TAB_ID` may not be accepted by every `rename-tab` path.
   - If Codex hook execution and agent command execution land in different cmux surfaces, set `CMUX_PIN_PROMPT_SCOPE=workspace` for the hook command so terminal surfaces in the same workspace receive the same prompt title.
7. Call:
   - `cmux rename-tab --surface "$CMUX_SURFACE_ID" "<compact title>"`
   - or `cmux rename-tab --tab <tab-ref> "<compact title>"` when falling back to `cmux identify`
   - `cmux set-status current-question "<original prompt>" --icon pin --color "#2563eb"` so the full prompt remains available outside the narrow tab label
8. Test with a sample stdin payload, confirm the tab/status changes, and measure foreground wrapper latency if the hook feels slow.
9. Tell the user to approve the new or changed Codex hook in `/hooks` when required.
10. Do not block Codex if cmux is unavailable. Ergonomic hooks should return success unless a requested setup action clearly failed.

## Workflow

1. Identify whether the task is a one-off cmux command, a reusable hook, a prompt-pinning setup, or a documented workflow.
2. Inspect local support with `command -v cmux`, `cmux --help`, and targeted `cmux docs ...` commands.
3. If editing hooks or config, locate the relevant config file and make a timestamped backup.
4. Implement the smallest useful automation:
   - tab title for the current question,
   - status for the longer original prompt context,
   - markdown panel for multi-agent boards,
   - feed integration for event queues.
5. For prompt pinning, install or update the actual hook script/config when the user asked to enable or test it.
6. Keep `UserPromptSubmit` hooks lightweight; avoid validation, `codex exec`, and broad git scans on every prompt unless the user explicitly wants blocking validation.
7. Keep scripts portable: no machine-specific absolute paths, no secrets, no socket password in source.
8. Test with dry-run payloads when possible before relying on live hooks.
9. Document user-facing commands and any manual approval step such as Codex `/hooks` review.

## Ask Before Changing

Ask the user before:

- installing or uninstalling cmux hooks globally,
- editing global cmux settings or socket authentication,
- sending text or keypresses to another pane,
- closing, moving, or clearing surfaces, panes, tabs, workspaces, logs, or history,
- changing a hook that affects every Codex session rather than one project.

## Validation

For this repo, run:

```bash
node scripts/validate-skill.ts skills/cmux-automation
node skills/cmux-automation/scripts/validate-cmux-automation.ts skills/cmux-automation
node scripts/validate-skill-html.ts .
node scripts/validate-skill-repo.ts .
```

For a real hook implementation, also run the prompt pin script with a sample stdin payload and confirm the cmux command updates the current tab/status inside cmux and degrades gracefully outside cmux.
