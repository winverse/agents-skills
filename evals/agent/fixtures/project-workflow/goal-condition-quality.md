Skill: project-workflow
Lane: goal condition quality

Runtime adapter:
- Claude Code: `/goal` supported as session-scoped completion condition.
- Other agents: use the same condition as a completion checklist.
- Repo convention: every `/goal` reference means Claude Code's `/goal` feature.

Goal condition draft:
- measurable end state: all selected refactor tests pass and `git diff --check` is clean.
- check evidence: transcript includes the exact test command output and `git status --short`.
- constraints: preserve unrelated user changes, do not force-push, do not delete branches, do not expose secrets.
- turn/time bound: stop after 8 turns or 45 minutes and report remaining blockers.

Do not use:
- unbounded perfection wording
- open-ended improvement wording
