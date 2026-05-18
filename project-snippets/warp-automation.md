## Project Skills

- Use $warp-automation at <skills-root>/skills/warp-automation/SKILL.md when Warp should use the assistant response as the visible title. The skill only changes response format: write a short summary of the user's current prompt on the first line, keep it 32 characters or fewer, leave the second line blank, then continue the real answer on the third line.

## Project-Specific Overrides

- Do not add `Q:`, `Prompt:`, markdown headings, quotes, or numbering before the first-line title.
- Do not expose secrets, tokens, private URLs, full local paths, or personal identifiers in the first-line title.
- Do not run terminal or config workflows unless the user separately asks for that work.
- If the user asks to test whether Warp title fallback works, answer in the same first-line title format so the UI can select that response value.
