# Workflow Fixture: Existing API Structure Cleanup

Skill: workflow
Mode: Architecture cleanup

Current authority:
- Existing AGENTS.md/CLAUDE.md, docs, package scripts, tests, API routes/controllers/resolvers, DB/cache/auth boundaries.

Next step:
- Write current boundary map before refactor.
- Use project-structure as an architecture cleanup audit, not as a new scaffold.
- Preserve existing REST API unless the user explicitly asks to migrate to GraphQL.

Artifacts
- `.scratch/api-structure-cleanup/specs/<date>-current-structure-audit.md`
- `docs/adr/0001-api-structure-and-boundaries.md`
- `docs/structure.md`
- staged refactor issues and characterization checks

Validation
- Do not force full PRD when behavior is unchanged.
