# Interline Design Review Reference

This reference adapts the local Interline design preferences into a reusable review checklist.

## Core Taste

- Quiet operational UI, not marketing composition.
- Fast scanning, restrained color, shallow borders, minimal shadow.
- No decorative gradients, orbs, bokeh, oversized hero sections, or illustration-first layout.
- Cards are for repeated items, modals, and framed tools. Do not put cards inside cards.
- Page sections should be unframed layouts or full-width bands, not floating cards.

## Tokens To Prefer

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

## Controls And States

- Use familiar controls: icon buttons for navigation/tools, toggles for binary state, selects/segmented controls for options, sliders/inputs for numbers.
- Every interactive control needs visible focus and accessible labeling.
- Empty, loading, partial, and error states should be compact and actionable.
- Do not rely on hover-only disclosure.

## Interline Product Screens

Use this section when reviewing the Interline study app or UI derived from its local design source.

- `Library`: show `Book Series` first, then ungrouped `Book` items without redundant headings. Keep covers compact and fixed-ratio.
- `Book Detail`: separate `Book Cover` from `Section List`; on mobile, cover comes before section navigation.
- `Section Study`: desktop order is `Sentence List | Study Panel | Study Settings`; mobile order is `Study Panel`, `Study Settings`, then `Sentence List`.
- `Sentence List`: navigation only. Show sentence number, English preview, and selected/current state; do not mix `Study Translation`, `Book Translation`, or `Vocabulary Note` into rows.
- `Study Panel`: primary content is `Chunked Sentence` and `Study Translation`; `Book Translation` and `Vocabulary Note` are disclosures, collapsed by default.
- `Study Settings`: session-wide settings live outside the reading panel. `Chunking Level` is a real select/control with `beginner`, `intermediate`, and `advanced`, not static text.
- Navigation controls: previous/next sentence use stable icon buttons with accessible labels and disabled states at boundaries.

## Interline Implementation Cues

- Icon family should stay consistent; the source preference is Coolicons rather than mixing multiple icon sets.
- Motion should clarify state changes. The source preference is Motion for React, with short opacity/transform transitions and reduced-motion support.
- `Book Cover` uses browser-safe `coverImageUrl`; do not wire raw local filesystem paths such as `coverImagePath` directly into `<img>`.
- Loading placeholders must preserve cover, row, and reading-panel dimensions to avoid layout shift.
- Raw generated labels such as `학습용 직역:` should not be repeated in the visible study text if they are data prefixes rather than UI copy.

## Motion

- Motion should clarify state changes, not decorate.
- Prefer opacity and transform.
- Avoid looping animation, bounce, shimmer overuse, and large entrance animation.
- Respect reduced motion.

## Review Questions

- Can the user scan the screen quickly and continue the task?
- Does the first viewport reveal the actual product/workflow, not just explanation?
- Are controls predictable and sized stably?
- Are Korean and English strings wrapping cleanly?
- Does any text or UI overlap at desktop or mobile sizes?
- Is the page dominated by one hue, unnecessary cards, or decorative effects?
