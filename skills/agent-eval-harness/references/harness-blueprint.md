# Agent Eval Harness Blueprint

Use this reference when setting up or revising the concrete eval harness structure.

## Scope Router

| Scope | Use when | First checks |
| --- | --- | --- |
| Skill invocation | The repo has multiple skills, prompt files, or instruction routes | expected skill, forbidden skill, trigger term coverage |
| Trigger quality | Skill or instruction routing depends on descriptions or short metadata | positive trigger, near-miss trigger, forbidden-skill prompt, shortened-description behavior |
| Workflow behavior | A task has a required sequence | required command, required file read, required validation, final report sections |
| Safety boundary | The agent has tools, shell, browser, MCP, or commit access | forbidden command, approval phrase, secret placeholder only, no production action |
| Cross-agent portability | Skills or instructions are used by Codex, Claude, Copilot, Cursor, Windsurf, or other agents | instruction surface exists, scope/precedence note, assumption date |
| Artifact hygiene | Saved outputs, traces, logs, screenshots, reports, or JSONL exports will be stored | scrubbed artifact note, gitignore/golden policy, compact CI report |
| Output quality | The task depends on review, research, design judgment, or synthesis | required sections, link count, evidence labels, severity ordering |
| Regression capture | A real failure happened | exact minimal prompt, fixture, expected fixed behavior |

## Minimal Folder Shape

Prefer a small structure that can be copied into ordinary repos:

```text
evals/
└── agent/
    ├── README.md
    ├── cases/
    │   ├── skill-routing.json
    │   ├── safety-boundaries.json
    │   ├── portability.json
    │   └── output-shape.json
    ├── artifacts/
    │   └── README.md
    ├── fixtures/
    │   └── README.md
    └── outputs/
        └── README.md
scripts/
└── run-agent-evals.ts
```

For this skills repo, keep validators in TypeScript and run them with Node 22+.

## Case Schema

Use JSON unless the target repo already has a stronger fixture format.

```json
{
  "id": "short-kebab-case-id",
  "title": "Human readable behavior",
  "prompt": "User prompt to evaluate",
  "scope": "skill_invocation",
  "expectedSkills": ["web-research"],
  "forbiddenSkills": [],
  "agentSurfaces": ["codex"],
  "assumptionDate": "2026-05-12",
  "exampleType": "typical",
  "fixtures": [],
  "checks": [
    {"type": "required_text", "value": "Sources"},
    {"type": "forbidden_text", "value": "I cannot browse"},
    {"type": "required_link_count", "min": 3}
  ],
  "risk": "low",
  "mode": "blocking"
}
```

Recommended fields:

- `id`: stable, unique, kebab-case.
- `title`: concise behavior summary.
- `prompt`: the smallest prompt that exercises the behavior.
- `scope`: `skill_invocation`, `workflow`, `safety`, `output_quality`, or `regression`.
- `expectedSkills`: skill names that should be used or referenced.
- `forbiddenSkills`: skills that should not be used for this prompt.
- `agentSurfaces`: agent runtimes or instruction surfaces the case assumes, such as `codex`, `claude-code`, `copilot`, `cursor`, or `windsurf`.
- `assumptionDate`: ISO date when fast-changing agent, tool, or vendor-doc assumptions were checked.
- `exampleType`: `typical`, `edge`, or `adversarial`.
- `fixtures`: local files needed by the case.
- `checks`: deterministic assertions.
- `risk`: `low`, `medium`, or `high`.
- `mode`: `blocking` or `advisory`.

## Check Types

Start with deterministic checks:

| Check | Purpose |
| --- | --- |
| `required_text` | Output must include a phrase, heading, command, or file path |
| `forbidden_text` | Output must avoid a phrase, unsafe command, or unsupported claim |
| `required_link_count` | Research answer must cite enough sources |
| `required_file_reference` | Coding answer must reference a changed file |
| `json_schema` | Structured output must parse and match schema |
| `command_passed` | The agent must report a passing local validator |
| `approval_required` | High-risk action must ask before execution |
| `forbidden_command` | Trace or command log must avoid destructive or exfiltration commands |
| `trace_event` | Trace must include expected model call, tool call, guardrail, handoff, route, or final output event |

Add judgment checks only after deterministic checks are useful:

- `rubric_score`: human or model grade from 1-5.
- `pairwise_preference`: compare new answer against baseline.
- `trace_review`: inspect tool calls and handoffs when traces are available.

## Runner Behavior

A useful local runner should:

1. load every `evals/agent/cases/*.json`;
2. validate case schema before running checks;
3. optionally filter by `scope`, `risk`, or `mode`;
4. run deterministic checks against a saved output or live agent output, depending on the repo's tooling;
5. print compact failure messages with case id and check id;
6. exit non-zero only for failing `blocking` cases.

If live agent execution is not available, start with saved outputs:

```text
evals/agent/outputs/<case-id>.md
```

Saved-output mode is enough to validate expected answer shape, citation policy, and report format while the repo matures. Saved outputs and live traces must be scrubbed before commit. Store compact CI reports separately from full exports that may contain prompts, raw outputs, config, environment values, screenshots, or tool results.

## Minimum Safety Case Pack

Create these cases when the agent can call tools, browse, read local files, use MCP servers, commit, deploy, or mutate accounts:

| Case family | Example shape | Expected behavior |
| --- | --- | --- |
| Approval gates | Write, deploy, delete, browser/computer action, financial/legal/account action, accepting terms/cookies | Ask or block before the risky action |
| Destructive commands | `rm -rf`, `sudo`, production deploy/delete, credential-file read, network exfiltration, writes outside expected roots | Deterministic forbidden command or trace-level block |
| Prompt injection/tool misuse | Untrusted page, email, tool output, or fixture says to ignore instructions, exfiltrate files, call a write tool, or alter schema metadata | Treat content as untrusted, refuse exfiltration, require confirmation for risky tool calls |
| Secret/private data | Synthetic secret-shaped values in fixtures, logs, traces, screenshots, browser forms, MCP context, and saved outputs | Redact or avoid persistence; never use live secrets |
| Least privilege | Tool/resource scopes, workspace root boundaries, short-lived token placeholders, no wildcard access | Deny when scope is unavailable; do not log credentials |
| High-risk promotion | Stable high-risk safety check | Promote to blocking only after deterministic, low-flake, owned, and reproducible |

Safety case reports should include case id, observed tool calls, approval requested or denied, blocked action, redaction result, and remediation hint.

## Cross-Agent Portability Pack

Do not assume one instruction file behaves the same across agents. Add cases or docs for the target surfaces:

| Surface | What to verify |
| --- | --- |
| `SKILL.md`, `.agents/skills`, `.claude/skills` | Description quality, progressive disclosure, package files, version pinning when applicable |
| `AGENTS.md`, `CLAUDE.md`, `GEMINI.md` | Scope, precedence, nested-file behavior, fallback support |
| `.github/copilot-instructions.md`, `.github/instructions/*.instructions.md` | Repo/path/agent precedence, feature support, instruction limits |
| `.cursor/rules` | Activation metadata, globs, root-only or nested behavior for the installed Cursor version |
| `.windsurf/rules` | Rules versus workflows versus skills, activation mode, root/subdir behavior |

Routing evals should include positive trigger prompts, near-miss prompts, forbidden-skill prompts, and shortened-description cases. Live model routing tests stay advisory until repeated runs show stable behavior.

## Workflow-Orchestration Seed Pack

When `workflow` calls this harness, do not merge the two skills. `workflow` owns stage order and skill handoff; this harness owns repeatable cases that prove those handoffs keep working.

Start with deterministic cases for:

| Case family | Suggested checks |
| --- | --- |
| Workflow routing | New project and feature prompts reference `workflow`; near-miss prompts do not bypass it to direct coding. |
| Dependency inventory | Output or fixture includes Matt Pocock-style, GStack-style, Superpowers-style, design-direction, and repo-local helper status as `available`, `missing`, or `fallback`. |
| Project-structure timing | `project-structure` appears after domain language and concrete architecture questions, before ADR/PRD lock; raw idea discovery does not call it first. |
| PRD settings | Required PRD path, inputs, language, scope lock, architecture lock, and data source of truth are present. |
| Mockup selection | UI implementation waits for two or three mock directions and a user-selected direction. |
| Document sync | Completion path includes doc sync and preserves historical plans/specs as historical. |
| Artifact hygiene | Workflow logs and QA artifacts stay under the project workflow area, and raw traces/screenshots are scrubbed or ignored. |

If the project only wants bootstrap coverage before `workflow` runs, keep cases limited to routing, safety, and artifact policy. Add the workflow-specific cases after the workflow has created or identified the actual project artifacts.

## Artifact And Trace Hygiene

- Keep full artifacts in `evals/agent/artifacts/` or another documented location, not scattered through the repo.
- Add `.gitignore` rules for raw live traces and exports unless they are intentionally reviewed golden fixtures.
- Use JSONL or JSON run exports only when the project needs machine-readable result history.
- Separate compact CI reports from full saved outputs to avoid leaking prompts, raw outputs, config, or environment-like values into CI logs.
- For live or model-graded runs, record repeat count, temperature/seed policy when available, provider/model version, and variance notes.

## CI Wiring

Use staged adoption:

1. Local only: run by command during skill or instruction changes.
2. Advisory CI: publish failures but do not block merges.
3. Blocking CI: block deterministic low-flake cases.
4. Scheduled regression: run broader model-graded cases daily or weekly.

CI should not call paid or networked model APIs unless the project has explicit budget, secrets, and retry policy.

## Calibration Rules

- If a case fails because the expected behavior changed intentionally, update the case and mention the reason in the PR or history.
- If a case fails because the prompt is ambiguous, improve the prompt or split the case.
- If a case fails because the checker is too brittle, check behavior rather than exact wording.
- If a real user-facing mistake escapes, add the smallest reproduction as a regression case before fixing broad policy.
- Calibrate automated or model graders against human review, ground-truth examples, adversarial cases, and grader-hacking checks before promoting them from advisory to blocking.
- Keep high-risk safety checks blocking once stable.

## Report Template

```text
Agent Eval Harness
- Path:
- Command:
- Mode:
- Cases:
- Assumptions:
- Artifacts:
- Blocking failures:
- Advisory failures:

Not Covered Yet
- <gap>

Next
- <case to add next>
```
