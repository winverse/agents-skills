## Project Skills

- Use $course-evaluator at <skills-root>/skills/course-evaluator/SKILL.md when asked to grade student answer CSVs, spreadsheets, assignment responses, course quizzes, rubric-based submissions, or educational feedback files into one Markdown file per student.

## Project-Specific Overrides

- Parse CSV and spreadsheet inputs with a structured parser; do not split by lines because answer cells may contain embedded newlines.
- Default to `평가/학생명.md` per student unless the user explicitly asks for a combined report.
- Keep score policy and comment quality separate: lenient or rough scoring must still produce individualized, gap-focused feedback.
- When the user asks for `합쇼체`, `되게 잘`, `거의 모범 정답까지`, or `놓친 부분으로`, write polished formal Korean feedback that names what each student got right and the exact concept they missed.
- Before finishing, verify student count, generated file count, score totals, missing answers, and repeated stock phrases.
