# Visual Guide Standards For `skill.html`

These rules adapt the shared quiet operational visual defaults used during initial design and a small set of external visualization/accessibility references.

## Local Design System

Use these shared defaults:

- Quiet operational UI, not a marketing page.
- Fast scanning over decorative presentation.
- restrained color, shallow borders, minimal shadows.
- `8px` maximum card radius.
- No nested cards.
- No decorative orbs, bokeh, large gradients, or illustration-first layout.
- Stable dimensions for rows, controls, charts, and diagrams.
- `letter-spacing: 0`.
- Do not scale font size with viewport width.
- `skill.html` is a PC desktop-only guide. Do not design or verify a mobile layout.
- Set `html` and `body` to `width: 100%`, `min-height: 100%`, and the same background color so screenshots never show white gutters outside the intended page background.
- Center the page shell with `width: 100%`, a fixed `max-width`, `margin: 0 auto`, and horizontal padding. Do not use shell width formulas that can make screenshots look off-center.
- Use a quiet information-tool layout. The page should feel like an operational reference panel, not a landing page, poster, or dashboard demo.
- Prefer one strong content rail with a few compact companion grids. Do not turn every paragraph into an equal-weight card.
- Dark surfaces are allowed only for literal code, terminal tree output, or snippets. Avoid black or dark visual blocks for normal diagrams, flows, and navigation.
- Use visual rhythm from spacing, border, and alignment before adding color. Accent color should mark state or path, not decorate the page.
- Long file names, commands, and paths must wrap with `overflow-wrap: anywhere` or sit inside scrollable code/tree blocks.

## Language Policy

`skill.html` is read by the user at install or setup time, so visible labels should be Korean-first:

- Use Korean for headings, matrix cells, chart labels, legends, short notes, validation gates, and do/don't rules.
- Keep English when it is a code term, command, file name, library, protocol, product name, or exact skill name: `commit`, `push`, `repo`, `diff`, `SKILL.md`, `skill.html`, `HTML`, `GraphQL`, `TypeScript`, `Playwright`, `OpenAI`.
- If an English research or process term is useful but not obvious, write Korean first and keep the term in parentheses once: `출처 기록(source ledger)`, `분기 검색(fan-out)`, `중단 기준(stop rule)`.
- Avoid English-only generic UI labels such as `Decision Matrix`, `Workflow`, `Resource Map`, `Input / Output`, `Project Connection`, `Do`, `Do Not`, `Risk Meter`, and `Quality Gate`.
- Code snippets can keep their literal English instruction headers when they are meant to be copied into agent instruction files, but nearby explanatory labels should be Korean.

Recommended token baseline:

```css
:root {
  --bg: #F8FAFC;
  --surface: #FFFFFF;
  --surface-muted: #F1F5F9;
  --text: #111827;
  --muted: #6B7280;
  --border: #D1D5DB;
  --accent: #2563EB;
  --focus: #1D4ED8;
  --ok: #1F7A52;
  --warn: #A16207;
  --danger: #B42318;
}
```

## External Standards Applied

- IBM data visualization guidance: chart titles should express the main insight; labels and legends should define visual encodings; direct labels are preferred where possible; axes and grid should support scale reading without clutter.
- IBM technical diagram guidance: clarity and legibility are mandatory; diagrams should include a legend for color, line, style, and shape conventions when those encodings matter.
- CFPB data visualization guidance: choose chart type by task. Bar charts fit comparisons across categories.
- WCAG 2.2: use current WCAG guidance, keep normal text contrast at least 4.5:1, non-text visual marks at least 3:1 where needed, and do not rely on color alone to convey meaning.

Reference links:

- IBM data visualization basics: https://www.ibm.com/design/language/data-visualization/design/basics/
- IBM technical diagrams usage: https://www.ibm.com/design/language/infographics/technical-diagrams/usage/
- CFPB data visualization guidelines: https://cfpb.github.io/design-system/guidelines/data-visualization-guidelines
- WCAG 2.2: https://www.w3.org/TR/WCAG22/

## Required Visual Grammar

Every `skill.html` should include at least four of these:

1. **Decision matrix**: Show when to use, skip, combine, or ask.
2. **Workflow flowchart**: Show what the agent does in order.
3. **Priority chart**: Rank sources, resources, checks, or risks.
4. **Resource map**: Show `SKILL.md`, `references/`, `scripts/`, `assets/`, snippets, and output files.
5. **Input/output schema**: Show what the user provides and what the skill emits.
6. **Risk or confidence meter**: Show which cases need validation.
7. **Do/don't contrast**: Show acceptable and unacceptable behavior.

## Skill Explanation Grammar

Every skill page should explain the skill in the same order so the user can scan different skills without relearning the page:

1. **Purpose strip**: skill name, one-line Korean-friendly purpose, and the `SKILL.md + skill.html` file pair.
2. **Use decision**: use, revise/combine, skip, and ask/stop cases.
3. **Execution flow**: what the agent does first, second, third, and what counts as done.
4. **Input/output schema**: user inputs, files read, files written, and final response shape.
5. **Resource map**: `SKILL.md`, `references/`, `scripts/`, `assets/`, snippets, and validation files.
6. **Validation gates**: exact local validators, browser checks, and unresolved-risk notes.
7. **Misuse guardrails**: do/don't rules that prevent common failure modes.

Keep section names stable across skills unless the skill domain truly requires different wording. The contents can vary, but the page grammar should remain familiar.

## Clean Layout Recipe

Use this default layout unless a skill needs a domain-specific diagram:

- `body` background uses `--bg`; the centered `.shell` uses `max-width: 1120px` or `1192px` and desktop padding of `32px`.
- Header is a compact horizontal strip, not a hero. Use one title, one purpose sentence, and a small file-pair/status block.
- Main content uses a small number of full-width sections. Inside a section, use matrices, flows, tables, tree blocks, or maps as the visual object.
- Repeated item cards may use `border: 1px solid var(--border)`, `border-radius: 8px`, and `background: var(--surface)`. Do not place cards inside cards.
- Prefer row/table density for comparable information. Use 2-column grids only when two visuals are naturally paired.
- Keep charts shallow and labeled directly. Avoid large decorative SVGs whose only purpose is to fill space.
- Use `font-size` from the token scale: 12px metadata, 14px body, 16-18px section headings, 28px page title.
- Use `line-height: 1.55` for body text and `letter-spacing: 0` everywhere.
- Use `box-shadow` sparingly. Default to no shadow or a very small shadow only when a floating element needs separation.
- Links and file labels must not overflow their cells. Prefer short labels with full paths shown in code or description text.

## Diagram Rules

- Use inline SVG for diagrams that need lines, arrows, charts, matrices, or icons.
- Use CSS grid for layout and HTML text for labels when that improves wrapping.
- Always title the visual with the practical insight, not a generic label.
- Use direct labels on chart marks when possible.
- Add a compact legend when color, shape, or line type encodes meaning.
- Avoid 3D effects, decorative chart junk, and dense grid lines.
- Encode important states with text, shape, or position as well as color.

## Page Structure

Use this default order:

1. Header: skill name, one-line purpose, file pair.
2. Decision matrix: when to use or skip.
3. Workflow diagram: step-by-step behavior.
4. Priority or risk chart: what matters most.
5. Resource map: files and references.
6. Project connection block: exact `AGENTS.md` snippet.
7. Do/don't rules: prevent misuse.

## Verification

Before finishing a `skill.html`:

- Check desktop rendering.
- Confirm no text overlap.
- Confirm diagrams remain readable at the target PC width.
- Confirm browser console has no meaningful errors.
- Confirm all local links resolve if served from the skill folder.
