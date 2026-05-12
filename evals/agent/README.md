# Agent Eval Harness

This folder contains the repo-local starter harness for checking agent behavior contracts.

This repo already has strong static validators for skill files, HTML guides, snippets, and history. These eval cases cover the gap those validators do not cover directly: whether representative user prompts map to the intended skills, trigger wording, cross-agent instruction surfaces, safety boundaries, artifact hygiene, and final-answer shapes.

## Current Mode

- Runner: `node scripts/run-agent-evals.ts`
- Execution: deterministic contract checks only
- Live model calls: not enabled
- CI status: local-only until the runner stabilizes

## Structure

```text
evals/agent/
├── README.md
├── cases/
│   ├── skill-routing.json
│   ├── safety-boundaries.json
│   ├── portability-and-triggers.json
│   └── output-shape.json
├── artifacts/
│   └── README.md
├── fixtures/
│   └── README.md
└── outputs/
    └── README.md
```

## Adding A Case

1. Add the smallest prompt that exercises one behavior.
2. Name the expected skill or safety boundary.
3. Include `assumptionDate` and `agentSurfaces` when the case depends on fast-changing agent behavior.
4. Mark the example as `typical`, `edge`, or `adversarial`.
5. Prefer checks that read current repo files: `AGENTS.md`, `project-snippets/`, `skills/*/SKILL.md`, references, and compatibility docs.
6. Keep high-confidence deterministic checks `blocking`.
7. Mark judgment-heavy, live-routing, or future live-output checks `advisory` until calibrated.

Real agent failures should become regression cases before broad instruction rewrites.

## Artifact Policy

Do not store raw live traces, unsanitized saved outputs, screenshots with private data, production logs, environment dumps, real credentials, or customer data in this repo. Use synthetic data and scrubbed golden artifacts only. Keep compact CI reports separate from full exports.

## Safety Pack

Tool-enabled harnesses should include cases for approval gates, destructive command avoidance, prompt injection or tool misuse, secret/private-data redaction, least privilege, and high-risk blocking promotion once stable.
