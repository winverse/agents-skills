---
name: skill-to-html
description: Create or revise the human-facing `skill.html` that sits beside an agent-readable `SKILL.md`. Use when an agent creates, installs, forks, or updates a shared skill and needs a visual install-time guide with diagrams, charts, matrices, maps, flows, and quick human-readable structure instead of a text-only or card-partitioned summary.
---

# Skill To HTML

Use this skill immediately after `skill-creator` initializes or updates a skill. The output is a static `skill.html` file inside the same skill folder as `SKILL.md`.

Read `references/visual-guide-standards.md` before designing or revising a `skill.html`.

## Required Outcome

Every skill folder should contain:

```text
skill-name/
├── SKILL.md
└── skill.html
```

`SKILL.md` is the source instruction for agents. `skill.html` is for the user who wants to understand the skill quickly after installing it.

## Design Contract

Do not make `skill.html` a partitioned article. Use visual structure to reduce reading:

- Use a flowchart for the skill's workflow.
- Use a decision matrix for when to use, skip, or combine the skill.
- Use a source/file map for bundled resources.
- Use a compact chart for priorities, risk, confidence, or coverage.
- Use labels and legends directly in diagrams.
- Keep all visuals understandable without color alone.
- Keep text short, Korean-friendly, and scannable.

## HTML Rules

- Produce one static HTML file with embedded CSS and inline SVG when useful.
- Do not depend on external CDNs, fonts, scripts, images, or build tools.
- Use semantic HTML sections with readable headings.
- Use CSS grid and SVG for diagrams, charts, maps, timelines, funnels, and matrices.
- Paint the page background on both `html` and `body`.
- Center the main shell with `width: 100%`, `max-width`, `margin: 0 auto`, and horizontal padding.
- Use stable dimensions so diagrams do not jump between states or viewport sizes.
- Keep border radius at `8px` or less.
- Avoid decorative gradients, orbs, bokeh, oversized hero sections, and nested cards.
- Use restrained colors and enough contrast for text and non-text marks.
- Target PC desktop screens only. Do not spend effort on mobile-specific layout support.

## Visual Pattern Selection

Choose visuals based on the skill contents:

| Skill content | Preferred visual |
| --- | --- |
| Sequential workflow | Flowchart or timeline |
| Trigger conditions | 2x2 decision matrix or checklist map |
| Source priorities | Funnel, ranked stack, or bar chart |
| File/resource structure | Node map or directory diagram |
| Risk and confidence | Meter, heatmap, or small multiple bars |
| Inputs and outputs | Sankey-like flow or input/output schema |
| Do and do-not rules | Contrast table or split matrix |

## Creation Workflow

1. Read the target skill's `SKILL.md`.
2. Read only the relevant reference files named from `SKILL.md`.
3. Extract the skill's trigger, workflow, resources, output shape, and failure modes.
4. Pick 3-5 visual patterns from the table above.
5. Create or replace `skill.html` next to `SKILL.md`.
6. Verify the HTML in a desktop browser viewport when practical.
7. If the skill is part of this repo, update `README.md`, `AGENTS.md`, and `project-snippets/` only when paths or trigger wording changed.

## Quality Bar

The user should be able to answer these in under one minute:

- What does this skill do?
- When should this skill be used?
- What does the agent do first, second, third?
- What files belong to this skill?
- How do I connect it to a project?
- What should I avoid when using it?
