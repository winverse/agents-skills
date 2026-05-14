## Project Skills

- Use $browser-qa at <skills-root>/skills/browser-qa/SKILL.md when a task needs browser runtime verification, Playwright checks, screenshots, console or network inspection, accessibility snapshots, broken link checks, responsive layout checks, text overlap detection, or `skill.html` rendering QA.

## Project-Specific Overrides

- Do not enter secrets, credentials, payment data, or destructive actions during browser QA.
- Report browser findings with URL, viewport, reproduction step, evidence, and severity.
- Keep subjective design critique in `design-review`; use `browser-qa` for observable runtime behavior.
- Close Playwright/Chrome tabs after QA and stop any local HTTP/dev server started for the check unless the user explicitly needs it kept running.
