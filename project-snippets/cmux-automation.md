## Project Skills

- Use $cmux-automation at <skills-root>/skills/cmux-automation/SKILL.md when asked to automate, configure, debug, or document cmux workflows, including cmux hooks, Codex/Claude/OpenCode integrations, prompt-to-tab or prompt-to-status pinning, workspace/tab/pane/status automation, feed workflows, browser surfaces, or cmux CLI-driven session ergonomics.

## Project-Specific Overrides

- Prefer local cmux CLI output and `cmux docs ...` before assuming behavior.
- Keep cmux and agent hook changes project-local unless the user explicitly asks for global setup.
- Ask before installing/uninstalling hooks, editing socket auth, sending text into panes, closing surfaces, or clearing history.
- Use `cmux rename-tab`, `cmux set-status`, and `cmux markdown open` before heavier automation.
