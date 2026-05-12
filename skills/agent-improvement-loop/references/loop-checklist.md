# Agent Improvement Loop Checklist

Use this reference for broad improvement requests, spare-token work, repo hardening, or unclear repo shape.

## One Skill Or Two?

Prefer one `agent-improvement-loop` skill with two tracks.

Reason:

- invocation, validation, alignment, and quality are the same operating loop in both skill catalogs and normal repos;
- splitting too early creates duplicate rules and drift;
- the repo shape can be detected from files before the agent acts;
- users can say one natural request, such as "use remaining context to improve this repo", and the skill can choose the track.

Split into separate skills only when one track becomes independently owned, has its own validator suite, or needs a very different runtime. A likely future split would be:

- `skill-governance-loop`: skill catalogs, skill HTML, snippets, lifecycle history, skill evals;
- `repo-quality-loop`: application code quality, tests, CI, docs, observability, security checks.

## Budget Router

| Budget | Use When | Action |
| --- | --- | --- |
| Quick | User asks "what should improve?" or the repo is unfamiliar | Produce a ranked improvement list with evidence |
| Patch | High-confidence stale docs, missing links, missing validator entry | Edit the smallest complete package |
| Hardening | Repeated failures, missing tests, weak validation, risky automation | Add tests, validators, hooks, or eval cases |
| Maintenance | Long session, many changed files, stale generated docs | Reconcile README, instructions, snippets, history, generated guides |

Do not start a broad cleanup just because token budget remains. Token budget is a ceiling by default. Start from evidence: failing validators, stale paths, missing tests, repeated user corrections, or documented process gaps.

## Spend-Down Consent Gate

Spend-down mode must be opt-in. Ask one direct question before using a large remaining-token window:

```text
남은 토큰을 최대한 사용해서 안전한 backlog를 처리할까요? (예/아니오)
```

Then route from the answer:

| Condition | Mode | Behavior |
| --- | --- | --- |
| User answers yes, backlog is safe | Spend-down | Run safe backlog items in small multi-agent batches, merge findings, continue until backlog saturates or the useful window is nearly over |
| User answers no | Ceiling mode | Review one lane at a time and stop when extra work is unlikely to change decisions |
| User has already requested careful review | Ceiling mode | Do not ask again; proceed lane-by-lane |
| Quota/reset source unavailable | Ceiling mode unless user explicitly wants spend-down | Do not infer from context length; if yes, run only a bounded useful-work batch and report quota uncertainty |

Reliable reset data can size the batch. If reset is within 30 minutes, prioritize short independent lanes. If reset is not near, prefer ceiling mode even after a yes unless the user explicitly wants a broader batch.

Spend-down mode is for low-risk durable work: documentation sync, skill guide refresh, validator/eval tightening, test-gap reports, browser smoke checks, and independent review lanes. It is not permission for destructive commands, broad rewrites, global installs, production changes, dependency upgrades, or commits with unresolved risks.

## Staged Multi-Agent Review

Use multi-agent review to increase scrutiny, not merely to spend budget.

1. Define a narrow lane before spawning: invocation, validation, alignment, or quality.
2. Give each subagent raw artifacts and a bounded output format.
3. Prefer one lane at a time when the user answered no or asked for careful review.
4. Use small parallel batches in spend-down mode when lanes are independent and safe.
5. Merge evidence in the main agent and decide whether the next lane is still worth running.
6. Stop when new lanes repeat known findings or would only produce speculative cleanup.
7. Convert accepted findings into durable artifacts: docs, tests, validators, hooks, snippets, eval cases, or issue notes.

## Skills Repo Track

### Invocation

- Skill name is hyphen-case and specific.
- `description` states what the skill does and when to use it.
- README, AGENTS, project snippets, and `agents/openai.yaml` use the same trigger language.
- Project snippets are short enough to paste into other projects.
- Shared skills avoid Codex-only or Claude-only assumptions unless the file is explicitly an adapter.

### Validation

- `node scripts/validate-skill.ts skills/<name>` passes.
- Skill-specific validator exists for material workflows.
- Repo validator checks README, AGENTS, snippets, history, and validator commands.
- Common HTML validator checks portable static HTML and visual guide structure.
- Browser render is checked when the HTML changes materially.
- Hooks are advisory or blocking according to risk and are documented.

### Alignment

- `SKILL.md` is the source instruction.
- `skill.html` visualizes current behavior and has not drifted from `SKILL.md`.
- `references/` holds details that would bloat `SKILL.md`.
- `project-snippets/<name>.md` links to the current path.
- `history/skills.md` records material trigger, workflow, validator, snippet, rename, lifecycle, or deprecation changes.
- Local inspector notes keep only unresolved items.

### Quality

- Avoid adding broad style advice that belongs in a specific project.
- Avoid validators that only search for vague buzzwords.
- Prefer deterministic checks for paths, required sections, commands, and hard safety rules.
- Use examples only when they reduce ambiguity.

## General Repo Track

### Invocation

- Root instructions tell agents how to install, run, test, lint, typecheck, build, and verify.
- Long rules are split into docs, scripts, or project-specific skills.
- Repeated workflows have command names or scripts.
- Subdirectory instructions exist for monorepos when package rules differ.

### Validation

- Unit/integration/e2e tests match the repo's risk surface.
- Lint, typecheck, formatting, and generated artifact checks are documented and runnable.
- Secret scanning and dangerous action checks exist before commit or deploy.
- CI mirrors local validation instead of relying on chat-only instructions.
- UI work has browser or screenshot checks where practical.

### Alignment

- README setup commands match package manifests.
- Architecture docs match source boundaries.
- API docs match route/schema files.
- Generated docs or schemas have a refresh command.
- Stale docs are updated or explicitly marked as historical.

### Quality

- Prefer small, evidence-backed refactors.
- Add tests before changing fragile behavior.
- Remove dead code only when references prove it is unused.
- Improve observability at boundaries: logs, errors, health checks, metrics.
- Escalate unclear product or architecture choices to the user.

## Subagent Lanes

Use subagents when lanes are independent:

- one agent checks invocation and docs;
- one checks validation, tests, and hooks;
- one checks code quality risks;
- one checks stale generated artifacts or external docs if web access is needed.

Merge results in the main agent after each lane or small batch. Do not pass secrets, private logs, or unrelated project data to external tools.

## Done Criteria

- The improvement is tied to a clear trigger, validator, doc mismatch, test gap, or repeated failure.
- Updated files agree with each other.
- Relevant checks ran, or the reason they could not run is stated.
- Any unresolved ambiguity is a direct question, not a vague warning.
