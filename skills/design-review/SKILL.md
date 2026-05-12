---
name: design-review
description: Use when the user asks for design review, UI review, visual critique, layout critique, interaction critique, design-system fit, accessibility review, responsive design review, visual hierarchy review, product surface polish, or Interline-style design judgment. This skill applies the local Interline design preferences and reports concrete design findings without replacing browser runtime QA.
---

# Design Review

Use this skill to review UI quality and design fit. It focuses on visual hierarchy, density, spacing, typography, color, layout stability, states, accessibility, interaction affordances, and whether the interface matches the product's domain.

Read `references/interline-design-review.md` before reviewing UI that should follow the local Interline design taste.

For the Interline study app itself, apply the product-specific screen checks in that reference. They cover `Library`, `Book Detail`, `Section Study`, `Book Cover`, `Chunking Level`, `Study Settings`, `Sentence List`, disclosure states, icon family, motion, and asset behavior from the local design source.

## Boundaries

- Use `design-review` for subjective but grounded UI judgment.
- Use `browser-qa` for runtime proof: console, network, screenshots, actual overlap, broken links, and responsive rendering.
- Use `code-review` for implementation quality.
- If screenshots or browser evidence are missing and the review depends on rendering, request or run `browser-qa` first when practical.

## Review Principles

- Prefer quiet, operational UI over marketing-style composition.
- Favor dense but readable layouts for repeated work.
- Avoid oversized hero sections, decorative gradients, orbs, bokeh, nested cards, and card-heavy page sections unless the product context clearly needs them.
- Keep card radius at 8px or less unless the existing design system requires otherwise.
- Use stable dimensions for fixed-format controls, lists, panels, diagrams, covers, and toolbars.
- Do not scale type with viewport width. Keep letter spacing at 0.
- Use restrained color with enough contrast and avoid one-note palettes.
- Text should not overflow, overlap, or occlude adjacent UI.
- Mobile should reorder content by task priority instead of squeezing desktop columns.

## Workflow

1. Identify the surface, user task, audience, and design system in force.
2. Collect evidence: screenshots, browser view, component file, design doc, or rendered HTML.
3. Review in this order:
   - information hierarchy and task flow;
   - layout grid, density, spacing, and stable dimensions;
   - typography, line height, wrapping, and Korean/English mixed text;
   - controls, affordances, focus, hover, selected, disabled, loading, empty, and error states;
   - color, contrast, icon consistency, and motion restraint;
   - responsive ordering and mobile ergonomics.
4. Separate objective failures from taste recommendations.
5. Report findings with severity, visual evidence, and actionable design direction.

## Output Shape

```text
Design Findings
- [Severity] Surface - Issue, why it matters, and concrete design direction.

Strengths
- <only high-signal positives when useful>

Questions
- <only if design intent is unclear>

Follow-up QA
- <browser-qa or implementation checks needed>
```

Severity order: `Blocker`, `High`, `Medium`, `Low`, `Note`.

## Do Not

- Do not invent a new visual system when a local one exists.
- Do not turn operational apps into landing pages.
- Do not hide real workflow complexity behind decorative cards.
- Do not make claims about actual browser behavior without runtime evidence.
