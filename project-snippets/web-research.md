## Project Skills

- Use $web-research at <skills-root>/skills/web-research/SKILL.md when a task needs current facts, web verification, source comparison, citations, recommendations, product research, laws, regulations, technical documentation lookup, or structured search beyond simple keywords.

## Project-Specific Overrides

- Prefer the project's existing source hierarchy before general web results.
- Cite official docs or primary sources first.
- Keep final answers concise unless the project explicitly needs a report.
- Treat `web-search`, `web search`, `웹서치`, and `웹 검색` as aliases for `web-research`.
- For verified, noisy, broad, or high-stakes searches, use the smallest safe research budget, then query fan-out, concept blocks, aliases, official terms, source targeting, source ledgers, evidence scoring, extraction, counterexample search, and stop rules.
- For web-research, automatically use parallel sub-agent fan-out by default when the runtime permits delegation. Use single-agent research only when the user explicitly asks for it, private data is involved, runtime/tool policy blocks delegation, or the task is a tiny official quick check; state the skip reason when using this exception.
- Treat research that feeds a recommendation, comparison, implementation plan, skill update, PR, architecture note, or product decision as verified search unless one official source fully settles it.
