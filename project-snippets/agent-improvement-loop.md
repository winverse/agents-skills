## Project Skills

- Use $agent-improvement-loop at <skills-root>/skills/agent-improvement-loop/SKILL.md when asked to use spare token or context budget productively, improve agent skill usage, make skills easier to invoke, add or review validators, align documentation with source files, create self-improvement loops, or raise repo quality through tests, hooks, docs, evals, and review automation.

## Project-Specific Overrides

- Treat current repo files, tests, docs, and validators as the first evidence source.
- Choose the skills-repo track for skill catalogs and the general-repo track for application or library repos.
- Before any spend-down run, ask: `남은 토큰을 최대한 사용해서 안전한 backlog를 처리할까요? (예/아니오)`. If the answer is yes, run safe backlog items in small multi-agent batches; if no, treat token budget as a ceiling and review one lane at a time.
- Prefer durable artifacts over chat-only advice: update instructions, docs, snippets, validators, tests, hooks, or eval cases.
- Ask before changing broad policy, deleting context, installing global config, or splitting skills.
