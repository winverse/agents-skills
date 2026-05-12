---
name: design-review
description: Use when the user asks for design review, UI review, visual critique, layout critique, interaction critique, design-system fit, accessibility review, responsive design review, visual hierarchy review, product surface polish, or product-aware design judgment. This skill applies general UI review criteria across repositories, respects the target project's existing design system first, and uses the local quiet operational taste only as a fallback profile.
---

# Design Review

Use this skill to review UI quality and design fit across product, SaaS, dashboard, content, commerce, docs, tool, game, and internal application repos. It focuses on visual hierarchy, density, spacing, typography, color, layout stability, states, accessibility, interaction affordances, and whether the interface matches the product domain.

Read `references/design-review-criteria.md` for broad reviews, for any repo without a clear local design guide, or when the user asks for a thorough pass. If the target project has its own design system, product docs, screenshots, component library, or brand rules, treat those as the first source of truth.

## Boundaries

- Use `design-review` for subjective but grounded UI judgment.
- Use `browser-qa` for runtime proof: console, network, screenshots, actual overlap, broken links, and responsive rendering.
- Use `code-review` for implementation quality.
- If screenshots or browser evidence are missing and the review depends on rendering, request or run `browser-qa` first when practical.
- Do not import project-specific screen rules from another repo. Put project-only design rules in that project's instructions or overrides, not in this shared skill.

## Review Principles

- Respect the existing design system, brand, component library, and product domain before applying a default taste profile.
- Prefer quiet, operational UI for SaaS, admin, docs, developer tools, and repeated-work surfaces.
- Allow more expressive visuals for marketing, editorial, games, portfolios, or brand-heavy pages when that matches the product.
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
   - product domain fit and intended user task;
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
- Do not apply one project's screen-specific rules to another repo.
