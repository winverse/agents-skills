---
name: agent-eval-harness
description: Use when asked to set up, scaffold, configure, or improve an evaluation harness for agent skills, agent instructions, prompt routing, cross-agent portability, tool choice, guardrails, artifact hygiene, or repeatable AI-agent workflows. This skill helps create the initial eval dataset, fixture layout, local runner, grader checklist, CI gate, and regression capture process before a repo has mature agent evaluation infrastructure.
---

# Agent Eval Harness

Use this skill to set up the first practical evaluation harness for agent behavior. The goal is not to build a full eval platform. The goal is to create a small, repeatable loop that catches regressions in skill selection, instruction following, cross-agent instruction portability, tool routing, safety gates, and final-answer shape.

Load `references/harness-blueprint.md` when choosing folder layout, case schema, grader shape, or CI integration details.

## Core Contract

- Start small: create a local harness that can run 5-20 representative cases before adding dashboards or vendor-specific trace tooling.
- Define success criteria and metrics before writing cases. Initial suites should include typical, edge, and adversarial examples.
- Treat eval cases as source-controlled product artifacts. Do not leave them only in chat transcripts.
- Treat agent-system assumptions as dated and surface-specific. `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.github/copilot-instructions.md`, `.github/instructions/*.instructions.md`, `.cursor/rules`, `.windsurf/rules`, `SKILL.md`, `.agents/skills`, and `.claude/skills` have different scoping and precedence rules.
- Test behavior that matters:
  - which skill or instruction should trigger;
  - which positive, near-miss, and forbidden-skill prompts should route correctly;
  - which tools are allowed, avoided, or required;
  - what output shape is expected;
  - what safety or approval boundary must hold;
  - what evidence proves the task was handled.
- Prefer deterministic checks first: required phrases, forbidden actions, file/path expectations, schema validation, and validator command results.
- Use model or human grading only for judgment-heavy criteria such as review quality, design critique, research synthesis, or prioritization.
- Keep the harness runner boring and repo-local. Use the repo's existing runtime; in this skills repo, use Node 22+ and TypeScript.
- Never put real secrets, private customer data, or production credentials in eval fixtures. Use placeholders and scrubbed traces.
- Scrub saved outputs, traces, screenshots, logs, and exported reports before committing them. Full artifacts should be gitignored unless they are intentional golden fixtures.
- Require a minimum safety case pack when agents can use tools: approval gates, destructive commands, prompt injection or tool misuse, secret/private-data redaction, least privilege, and high-risk blocking promotion.
- Make failures easy to promote: when an agent makes a real mistake, turn the smallest reproducing prompt into a new eval case.
- Add CI only after the local command is stable. CI should block only high-confidence deterministic failures at first.
- Calibrate model-graded or live-agent cases against human review, edge cases, and repeat/variance evidence before making them blocking.

## Setup Workflow

1. Inspect the target repo for existing tests, scripts, instructions, skills, prompts, validators, CI, and agent logs.
2. Define the success criteria, failure modes, and metrics the harness will protect.
3. Choose harness scope:
   - **Skill invocation**: prompt should select the right skill or instruction.
   - **Workflow behavior**: agent should follow steps, ask when blocked, and run expected checks.
   - **Safety boundary**: agent should refuse, ask approval, avoid secrets, or avoid destructive actions.
   - **Cross-agent portability**: instruction files, skill packages, scope, precedence, and trigger descriptions should work per target agent surface.
   - **Output quality**: final answer should include required sections, citations, evidence, or file references.
   - **Artifact hygiene**: saved outputs, traces, logs, reports, screenshots, and fixtures should be intentionally stored and scrubbed.
4. Create the smallest durable structure:
   - `evals/agent/cases/*.json`
   - `evals/agent/fixtures/`
   - `evals/agent/artifacts/`
   - `evals/agent/README.md`
   - `scripts/run-agent-evals.ts` or the repo's equivalent runner
5. Define each case with an id, prompt, expected skill or workflow, checks, fixtures, risk tier, example type, assumption date, and agent surfaces where relevant.
6. Implement deterministic checks before model-graded checks.
7. Add a command to package scripts or repo docs, for example `node scripts/run-agent-evals.ts`.
8. Run the harness locally and fix either the case or the agent instruction until the baseline is meaningful.
9. Add CI only for stable checks. Mark judgment-heavy, live-routing, or flaky evals as advisory until they are calibrated.
10. Document how to add a failure case, how to scrub artifacts, and how to update expected behavior after an intentional skill change.
11. Report the harness path, command, baseline result, blocked cases, artifact policy, assumptions, and the next eval cases worth adding.

## Workflow Handoff Seed Cases

When this skill is called from `workflow`, keep the harness separate but seed cases that protect the workflow contract. A bootstrap harness may run before `workflow` only to check routing, safety, and artifact policy; full workflow regression cases should be added after `workflow` has identified domain, architecture, PRD, issue, design, and verification artifacts.

Create or adapt cases for:

- **workflow routing**: new project and feature prompts select `workflow` instead of jumping straight to coding or `project-structure`;
- **dependency inventory**: Matt Pocock-style, GStack-style, Superpowers-style, design-direction, and repo-local helper skills are recorded as `available`, `missing`, or `fallback`;
- **project-structure timing**: `project-structure` is used after domain language and concrete architecture questions, before ADR lock and PRD, not during raw idea discovery;
- **PRD settings**: PRD path, inputs, language, scope lock, architecture lock, and data source of truth are fixed before `to-prd`;
- **mockup selection**: substantial UI work requires two or three mock directions and a user-selected direction before implementation;
- **document sync and artifact hygiene**: completion calls doc sync, preserves historical plans/specs, and stores workflow logs, screenshots, traces, and QA artifacts under the project workflow area.

## Case Design

Good initial cases are small and named after the behavior they protect:

```json
{
  "id": "skill-routing-web-research-current-facts",
  "prompt": "Use web search to compare the latest MCP security guidance.",
  "expectedSkills": ["web-research"],
  "forbiddenSkills": ["browser-qa"],
  "agentSurfaces": ["codex"],
  "assumptionDate": "2026-05-12",
  "exampleType": "typical",
  "checks": [
    {"type": "required_text", "value": "date checked"},
    {"type": "required_link_count", "min": 3}
  ],
  "risk": "medium"
}
```

Do not overfit to one model's wording. Check the observable contract, not private reasoning.

## Harness Lanes

- **Routing lane**: maps user prompts to expected skills, tools, or instruction files.
- **Trigger quality lane**: includes positive trigger prompts, near-miss prompts, forbidden-skill prompts, and shortened-description behavior.
- **Procedure lane**: verifies required steps such as inspect -> patch -> validate -> report.
- **Cross-agent portability lane**: checks `SKILL.md`, `.agents/skills`, `.claude/skills`, `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.github/copilot-instructions.md`, `.github/instructions/*.instructions.md`, `.cursor/rules`, and `.windsurf/rules` without assuming identical semantics.
- **Safety lane**: checks the minimum safety case pack: approval gates, destructive command avoidance, least privilege, prompt injection/tool misuse, secret handling, and private-data scrubbing.
- **Artifact lane**: checks saved outputs, traces, screenshots, logs, JSONL/results exports, compact CI reports, and golden fixtures for scrubbed storage.
- **Evidence lane**: checks citations, browser evidence, validator outputs, screenshots, or file references.
- **Regression lane**: captures real failures from recent work and turns them into cases.

## Done Criteria

An initial harness is done when:

- a repo-local command runs the cases from a clean checkout;
- at least five representative cases pass or have explicit advisory status;
- success criteria, metrics, assumption dates, and target agent surfaces are documented for cases that depend on fast-changing agent behavior;
- the minimum safety case pack exists when the agent can use tools or external context;
- failures print the case id, prompt, failed check, and remediation hint;
- docs explain how to add a new case;
- saved outputs and traces have an explicit scrub/review policy;
- CI wiring is present, or a clear reason is documented for keeping the new harness local-only until the runner stabilizes.

## Output Shape

```text
Harness
- Scope: skill invocation | workflow | safety | output quality
- Path: <eval harness path>
- Command: <local command>
- CI: blocking | advisory | not added
- Assumptions: <agent surfaces and dates>
- Artifacts: <scrubbed/golden/gitignored policy>

Baseline
- Cases: <count>
- Passing: <count>
- Advisory: <count>
- Failing: <count and reason>

Changed
- <file>: <why it exists>

Next Cases
- <highest-value missing eval case>
```
