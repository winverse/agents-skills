---
name: agent-improvement-loop
description: Use when the user asks how to use spare token or context budget productively, improve an agent's skill usage, make skills easier to invoke, add or review validators, align documentation with source files, create self-improvement loops, or raise repo quality through tests, hooks, docs, evals, and review automation. Before any spend-down run, ask the user a yes/no question about whether to use the remaining token budget; otherwise use staged ceiling mode. Handles both this skills repo and ordinary code repos by choosing the right improvement track.
---

# Agent Improvement Loop

Use this skill to turn available agent capacity into durable repo improvements. The goal is not always to spend tokens; it is to ask whether the user wants a spend-down run or a careful staged review, then make future agent runs easier to trigger, easier to verify, and less likely to drift from the repo's actual state.

Load `references/loop-checklist.md` when the repo has more than one workflow, when the user asks for a broad improvement pass, or when you need to decide between the skills-repo track and the general-repo track.

## Core Contract

- Prefer one loop with two tracks over two separate skills unless the user explicitly wants separate ownership.
- Detect the repo shape before improving it:
  - **Skills repo track**: `skills/*/SKILL.md`, `skill.html`, `project-snippets/`, `history/skills.md`, or skill validators are present.
  - **General repo track**: application/library code, tests, package manifests, CI, API docs, or product docs are present.
  - **Hybrid track**: both exist; prioritize the files and workflows named by the user.
- Improve invocation, validation, and alignment as a package. Do not improve one while leaving stale docs, snippets, hooks, or tests behind.
- Convert repeated judgment into durable artifacts: instructions, skills, references, validators, tests, hooks, checklists, eval cases, or short docs.
- Keep standing instructions short. Move detailed rules into referenced files or executable checks.
- Put a consent gate before any spend-down run. Ask one direct question: `남은 토큰을 최대한 사용해서 안전한 backlog를 처리할까요? (예/아니오)`
- Use the answer to route work:
  - **Yes**: run spend-down mode with safe, reviewable, non-destructive backlog items. If reliable reset data is available and reset is within 30 minutes, prioritize small multi-agent batches. If quota data is unavailable, do not claim literal exhaustion; use a bounded useful-work batch and report the limit.
  - **No**: run **Ceiling mode**. Treat token budget as a ceiling, review one lane at a time, and stop when the next lane is unlikely to change the decision.
- Use staged multi-agent review for broad work: assign one independent lane or a small batch of lanes, merge evidence, decide the next lane, then continue.
- Ask the user before changing policy, deleting context, splitting a skill, installing global config, or making broad code rewrites.
- Run the repo's relevant validators or tests before calling the loop done.

## Workflow

1. Inspect the current state with `git status --short`, repo instructions, manifests, docs, and existing validation commands.
2. If the user mentions spare tokens, remaining context, reset windows, or broad self-improvement work, ask: `남은 토큰을 최대한 사용해서 안전한 backlog를 처리할까요? (예/아니오)`. Do not ask when the user has already answered clearly.
3. Check quota only from a reliable source exposed by the runtime, CLI, account UI, or the user's explicit numbers. Do not infer quota from conversation length.
4. Select budget mode:
   - user answered yes: run spend-down mode with safe backlog; use reset-time data only to size the batch;
   - user answered no, quota is unknown, or the user did not ask for spend-down: run ceiling mode.
5. Classify the repo as skills, general, or hybrid.
6. Choose the smallest useful loop:
   - quick loop: report the next 3-5 improvements;
   - patch loop: make small high-confidence fixes;
   - hardening loop: add validators, hooks, evals, or tests;
   - maintenance loop: reconcile docs, snippets, history, and visual guides.
7. Run four review lanes:
   - **Invocation**: trigger wording, skill names, command names, instruction links, discoverability, project snippets.
   - **Validation**: tests, validators, evals, hooks, CI, secret checks, browser or runtime checks.
   - **Alignment**: README, AGENTS, CLAUDE, docs, snippets, history, generated guides, and source code agree.
   - **Quality**: code structure, small refactors, typed boundaries, error handling, observability, dead code, duplicated rules.
8. For broad or high-risk work, use subagents lane-by-lane:
   - one subagent checks invocation or docs;
   - one checks validation, tests, hooks, or evals;
   - one checks code quality or architecture risks;
   - the main agent merges evidence before deciding the next step.
9. Implement only high-confidence changes. For ambiguous source-of-truth conflicts, ask a focused question.
10. Run validation and record remaining risk.
11. Report changed files, which loop was used, validation results, and unresolved decisions.

## Spend-Down Consent Gate

Before spend-down mode, ask exactly one direct yes/no question:

```text
남은 토큰을 최대한 사용해서 안전한 backlog를 처리할까요? (예/아니오)
```

Run spend-down mode only when all of these are true:

- the user answers yes;
- the task backlog is low-risk and reviewable;
- work can be stopped cleanly before reset or context compaction.

Reliable reset data is useful but not required for asking the question. If reset data is unavailable, say that literal token exhaustion cannot be guaranteed and run only a bounded useful-work batch.

Good spend-down backlog:

- run independent subagent review lanes and merge findings;
- refresh stale docs, snippets, and generated skill guides;
- add or tighten validators and eval cases;
- produce test-gap or docs-gap reports;
- run existing tests, validators, HTML checks, and browser smoke checks;
- write durable notes or issues for findings that should not be fixed immediately.

Never use spend-down mode for secret handling, destructive commands, broad rewrites, dependency upgrades, global config changes, production actions, or changes that need product judgment.

## Track Guidance

### Skills Repo Track

For this repo or any skill catalog, check:

- each skill has `SKILL.md` plus a current `skill.html`;
- trigger text is clear enough for automatic or explicit invocation;
- `agents/openai.yaml`, project snippets, README, AGENTS, and history use the same skill name and path;
- material skill changes update references, validators, snippets, `skill.html`, and history together;
- validators are TypeScript when the repo owns them;
- completed inspection notes are removed from ignored inspector scratch space.

Use companion skills when available:

- `skill-update` for changing an existing shared skill;
- `skill-to-html` for creating or refreshing `skill.html`;
- `sync-docs` for documentation consistency;
- `atomic-committer` for commit and push requests.

### General Repo Track

For ordinary code repos, check:

- agent instructions say how to install, test, lint, typecheck, run, and verify the app;
- repeated prompts have become commands, scripts, or skills rather than growing `AGENTS.md`;
- tests cover recently changed or risky behavior;
- CI/hook checks catch formatting, secrets, stale docs, type errors, and broken generated artifacts;
- docs describe the current code, not a past architecture;
- quality work is small, reviewable, and tied to evidence from the repo.

## Output Shape

Use a compact report:

```text
Loop
- Track: skills repo | general repo | hybrid
- Budget: ceiling | spend-down
- Spend-down consent: yes | no | not asked
- Mode: quick | patch | hardening | maintenance

Changed
- <file>: <why it improves invocation, validation, alignment, or quality>

Validation
- <command>: <pass/fail>

Open
- <only unresolved source-of-truth or policy questions>
```
