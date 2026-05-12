# Design Review Criteria

Use this reference for product-aware design review across repositories. It is intentionally general: project-specific screen names, business workflows, and app-only rules belong in that project's `AGENTS.md`, `CLAUDE.md`, design docs, or local overrides.

## Review Model

- Start from the target repo's existing design system, component library, screenshots, brand rules, and product docs.
- If local rules exist, evaluate consistency with those rules before applying generic taste.
- If local rules are missing, use the default taste profile below as a conservative baseline.
- Separate objective usability/accessibility/layout problems from preference-based recommendations.
- Pair with `browser-qa` when the finding depends on actual rendering, browser behavior, or responsive screenshots.

## Product Context Matrix

| Product surface | Default design direction |
| --- | --- |
| SaaS, CRM, admin, developer tools, internal ops | Quiet, dense, predictable, task-first, restrained visual styling |
| Docs, knowledge base, API reference | Readability, navigation clarity, search and examples, stable typography |
| Commerce, marketplace, booking | Trust, comparison, clear price/availability/status, low-friction actions |
| Marketing, portfolio, launch page | Brand signal, strong first viewport, visual storytelling, focused conversion |
| Games, creative tools, immersive media | Expressive visuals, motion and affordance clarity, interaction feedback |
| Mobile-first consumer flows | Thumb ergonomics, task priority ordering, progressive disclosure |

## Default Taste Profile

- Quiet operational UI, not marketing composition.
- Fast scanning, restrained color, shallow borders, minimal shadow.
- No decorative gradients, orbs, bokeh, oversized hero sections, or illustration-first layout unless the product type calls for it.
- Cards are for repeated items, modals, and framed tools. Do not put cards inside cards.
- Page sections should be unframed layouts or full-width bands, not floating cards.

## Token Baseline

- Background: `#F8FAFC`
- Surface: `#FFFFFF`
- Muted surface: `#F1F5F9`
- Text: `#111827`
- Muted text: `#6B7280`
- Border: `#D1D5DB`
- Accent: `#2563EB`
- Focus: `#1D4ED8`
- Radius: `4px` or `8px`
- Letter spacing: `0`

Use these as fallback tokens only when the target repo lacks tokens. Existing brand tokens win.

## Domain Fit

- The first viewport should reveal the actual product, workflow, object, or content being reviewed.
- Operational products should prioritize scan speed, comparison, repeated action, and dense but readable information.
- Marketing or brand pages may use larger imagery and stronger narrative, but the primary offer or object should be obvious.
- Avoid generic landing-page composition for tools that users repeatedly operate.
- Avoid dashboard density for editorial or brand-heavy pages where reading and persuasion are primary.

## Typography

- Use stable type sizes, not viewport-scaled type.
- Use readable line-height for mixed Korean and English.
- Prefer `overflow-wrap: anywhere` or layout fixes over shrinking text into unreadability.
- Reserve hero-scale type for real heroes.
- Use compact headings inside dashboards, cards, sidebars, and tools.

## Layout

- Use stable dimensions for cards, rows, boards, toolbars, covers, counters, and controls.
- Avoid layout shift between loading, hover, selected, disabled, and dynamic content states.
- Desktop can use multi-column layouts for operational density.
- Mobile should put the primary task first and then supporting controls/navigation.
- Do not preserve desktop column order on mobile when it hides the main task.

## Controls And States

- Use familiar controls: icon buttons for navigation/tools, toggles for binary state, selects/segmented controls for options, sliders/inputs for numbers.
- Every interactive control needs visible focus and accessible labeling.
- Empty, loading, partial, and error states should be compact and actionable.
- Do not rely on hover-only disclosure.
- Use one icon family per surface unless the existing system intentionally mixes icons.
- Controls should have stable dimensions across hover, focus, selected, disabled, loading, and validation states.

## Accessibility

- Text and non-text UI marks need enough contrast for their role.
- Interactive rows and controls need visible focus and useful accessible names.
- State should not be communicated by color alone.
- Touch targets should stay usable on mobile even in dense interfaces.
- Disclosure, tabs, menus, and popovers must be usable without hover.

## Responsive Strategy

- Identify the primary task for mobile and put it first.
- Collapse supporting navigation, filters, metadata, and secondary panels after the main task.
- Preserve stable control size and readable text wrapping instead of shrinking text aggressively.
- Check long words, mixed Korean/English text, numeric data, and badges for overflow.

## Motion

- Motion should clarify state changes, not decorate.
- Prefer opacity and transform.
- Avoid looping animation, bounce, shimmer overuse, and large entrance animation.
- Respect reduced motion.

## Evidence Boundaries

- Design review may flag likely overlap, weak hierarchy, poor affordance, or missing states from screenshots or code.
- Use `browser-qa` before asserting actual console failures, network failures, broken links, measured overflow, or browser-specific behavior.
- If there is no screenshot or rendered view, label visual judgments as code/design-doc inferences.

## Review Questions

- Can the user scan the screen quickly and continue the task?
- Does the first viewport reveal the actual product/workflow, not just explanation?
- Does the visual treatment match the product category and audience?
- Is the existing design system being followed?
- Are controls predictable and sized stably?
- Are Korean and English strings wrapping cleanly?
- Does any text or UI overlap at desktop or mobile sizes?
- Is the page dominated by one hue, unnecessary cards, or decorative effects without product reason?
