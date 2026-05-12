## Project Skill: Project Structure

- For choosing, creating, standardizing, or refactoring frontend, backend, full-stack monorepo, or desktop app folder structures, use the shared skill at `<skills-root>/skills/project-structure/SKILL.md`.

## Project Structure Overrides

- Prefer numeric choices when the project kind or stack is not clear.
- Default to Bun, Turborepo, Next.js, NestJS with Fastify, GraphQL, urql, GraphQL Code Generator, PostgreSQL, Drizzle, Panda CSS with headless UI, Tauri, and Zod env validation unless the project says otherwise.
- Use `apps/web` or `apps/api` by default even for standalone frontend/backend projects unless the existing repo or user explicitly wants a root-level app.
- Use app-local env schemas and keep `packages/config` as helper-only. Shared packages must not read `process.env` directly.
- Keep app-owned env/codegen paths consistent across web, API, and desktop where applicable: `<app>/env/*`, `<app>/src/config/env.ts`, `<app>/codegen.ts`, and `<app>/src/graphql/autogen.ts`.
- In monorepos, keep Redis client, key, and connection helpers in `packages/db/src/redis`; API apps should wrap that boundary through `apps/api/src/providers/cache`.
- Keep API structured logging in `apps/api/src/providers/logger` and request logging integration in `apps/api/src/common/interceptors`.
- Keep Drizzle migration SQL and metadata in `packages/db/drizzle`; do not duplicate migration files under `src/migrations`.
- When GraphQL is selected, define the schema/document/autogen contract and choose one generated artifact policy: ignored and reproducible, or committed and reviewed.
- Represent frontend Panda CSS tokens/recipes/generated output, backend health/security/observability, and app-level test surfaces in the final tree when those capabilities are selected.
