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
- Keep project-local hook changes project-local unless the user explicitly asks for global cmux or global Codex configuration changes.
- Back up existing cmux or agent config files before editing them.
- Use `cmux rename-tab`, `cmux set-status`, and `cmux markdown open` for lightweight session memory before building heavier tooling.
- Fail quietly for ergonomics hooks when cmux is not available or the terminal is outside cmux.
- Ask before installing/uninstalling hooks, changing global cmux settings, editing socket auth, closing panes/workspaces, clearing history, or sending text into another pane.

## Common Jobs

| Job | Preferred cmux surface |
| --- | --- |
| Show the current user question in the tab header | `cmux rename-tab` from a prompt hook |
| Keep a longer question visible | `cmux set-status current-question ...` |
| Keep a multi-agent work board | `cmux markdown open <board.md>` |
| Route agent events into a queue | `cmux feed tui` or `cmux hooks feed` |
| Debug whether cmux is available | environment variables, `cmux identify`, `cmux capabilities` |
| Modify cmux settings | `cmux docs settings`, `cmux settings path`, backup first |

## Prompt Pinning Pattern

When the user wants each submitted question to appear in the current cmux tab:

1. Add or update a Codex `UserPromptSubmit` hook.
2. Parse the hook JSON from stdin.
3. Extract the submitted prompt from known payload fields, and log once during discovery if the field name is unknown.
4. Normalize whitespace and truncate for a tab-sized title.
5. If a cmux environment variable exists, call:
   - `cmux rename-tab "Q: <short prompt>"`
   - optionally `cmux set-status current-question "<longer prompt>" --icon pin --color "#2563eb"`
6. Do not block Codex if cmux is unavailable. Ergonomic hooks should return success unless a requested setup action clearly failed.

## Workflow

1. Identify whether the task is a one-off cmux command, a reusable hook, or a documented workflow.
2. Inspect local support with `command -v cmux`, `cmux --help`, and targeted `cmux docs ...` commands.
3. If editing hooks or config, locate the relevant config file and make a timestamped backup.
4. Implement the smallest useful automation:
   - tab title for short memory,
   - status for longer prompt context,
   - markdown panel for multi-agent boards,
   - feed integration for event queues.
5. Keep scripts portable: no machine-specific absolute paths, no secrets, no socket password in source.
6. Test with dry-run payloads when possible before relying on live hooks.
7. Document user-facing commands and any manual approval step such as Codex `/hooks` review.

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

For a real hook implementation, also test the script with a sample stdin payload and confirm the cmux command degrades gracefully outside cmux.
