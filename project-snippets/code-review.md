## Project Skills

- Use $code-review at <skills-root>/skills/code-review/SKILL.md when a task asks for code review, PR review, diff review, implementation audit, regression risk review, missing test review, maintainability review, or JavaScript and TypeScript style review.

## Project-Specific Overrides

- Findings come first, ordered by severity, with file and line references when possible.
- For JavaScript and TypeScript, prefer clear functional collection style such as `map`, `filter`, `flatMap`, `reduce`, predicate helpers, and `Iterable` patterns when they improve clarity.
- Do not force functional style when loops, early returns, async sequencing, or performance-sensitive code are clearer.
- Treat SRP, SOLID boundaries, missing tests, and security risks as first-class review concerns.
