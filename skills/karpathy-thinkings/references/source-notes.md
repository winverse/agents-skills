# Source Notes

This repo's `karpathy-thinkings` skill is an unofficial local adaptation. It should preserve the practical substance of widely circulated Karpathy coding-agent guidance without claiming official endorsement.

## Public Sources

- Andrej Karpathy's public comments on LLM coding pitfalls: wrong assumptions, hidden confusion, overcomplication, unrelated edits, and weak verification.
- The community package `forrestchang/andrej-karpathy-skills`, which packages those observations as a `CLAUDE.md`, plugin, Cursor rule, and reusable skill under the name `karpathy-guidelines`: https://github.com/forrestchang/andrej-karpathy-skills

## Local Adaptation Rules

- Keep the four recognizable pillars:
  - Think Before Coding
  - Simplicity First
  - Surgical Changes
  - Goal-Driven Execution
- Do not copy long passages verbatim from external docs.
- Keep this repo's skill agent-neutral so it works for Codex, Claude, and other agents.
- Make uncertainty and verification explicit, but do not force unnecessary planning for tiny edits.
- Bias toward practical engineering behavior over motivational slogans.

## When Updating

Preserve the intent:

- assumptions are surfaced,
- overengineering is resisted,
- unrelated edits are avoided,
- success is verified.

If a future public source changes the framing, update this reference first, then update `SKILL.md`, `skill.html`, snippets, README, AGENTS, and history through `skill-update` and `sync-docs`.
