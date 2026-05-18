## Project Skills

- Use $terminal-session-automation at <skills-root>/skills/terminal-session-automation/SKILL.md when asked to automate, configure, debug, or document cmux, Warp, or generic terminal session workflows, including prompt-to-tab/title pinning, session status, workspace boards, workflow notes, launch/workflow configs, hook latency, and terminal-specific CLI or escape-sequence behavior.

## Project-Specific Overrides

- Detect the terminal host first. Use `CMUX_*` and `cmux --help` for cmux, `TERM_PROGRAM=WarpTerminal` and `/dev/tty` title output for Warp, and safe shell title/workflow notes for generic terminals.
- Keep terminal, cmux, Warp, Oz, and agent hook changes project-local unless the user explicitly asks for global setup.
- Ask before installing/uninstalling hooks, editing socket auth, sending text or keypresses into panes, closing tabs/surfaces/workspaces, clearing history, or changing global terminal settings.
- Use `cmux rename-tab`, `cmux set-status`, and OSC title sequences before heavier automation; degrade quietly when the current host cannot expose a safe title/status surface.
