---
name: project-structure
description: Use when a user asks to choose, create, standardize, or refactor a web, backend, full-stack monorepo, or desktop app folder structure. This skill asks compact numeric choices, applies the user's default stack preferences, and produces a consistent project layout with env, GraphQL codegen, Drizzle migration, and Tauri build policies.
---

# Project Structure

Use this skill when the user asks how to structure a project, create a new project skeleton, align an existing repo to a consistent layout, or choose folders/stacks for frontend, backend, full-stack monorepo, or desktop apps.

## First Move

If the project kind is not already clear, ask a compact numeric choice:

```text
1. Frontend web
2. Backend API
3. Full-stack monorepo
4. Desktop app
```

Then ask only the stack choices that matter for that kind. Prefer defaults unless the user says otherwise.

Use compact numeric menus, not long architecture questionnaires. Ask a menu only when the answer changes the tree:

```text
API contract: 1 GraphQL default, 2 REST, 3 hybrid
DB: 1 PostgreSQL + Drizzle default, 2 no DB, 3 external DB
Cache: 1 Redis through cache boundary default when cache/session is needed, 2 no Redis
Auth: 1 app-owned auth module default when auth is needed, 2 external auth, 3 no auth
Generated artifacts: 1 ignored and reproducible default, 2 committed and reviewed
Desktop shell: 1 Tauri + Vite React default, 2 Tauri + existing frontend shell
```

## Default Stack

| Area | Default |
| --- | --- |
| Package manager | Bun |
| Monorepo | Turborepo |
| Frontend web | Next.js |
| Backend API | NestJS with Fastify adapter |
| API contract | GraphQL |
| GraphQL client | urql |
| GraphQL typing | GraphQL Code Generator required |
| Database | PostgreSQL |
| ORM | Drizzle |
| CSS/UI | Panda CSS with Ark UI or Park UI style headless components |
| Desktop | Tauri |
| Env validation | Zod |
| Testing shape | colocated unit/component tests, app-level e2e tests |
| Observability | logger, request logging, health/readiness, metrics/tracing boundary |

Do not offer a full-stack single-repo layout by default. The preferred full-stack shape is a monorepo.

## Env Policy

Apply this policy to every generated or refactored structure:

- App-local env schema.
- Zod validation required.
- Env files per app.
- `packages/config` provides helpers only.
- Frontend public env and server env are separated.
- Shared packages never read `process.env` directly.
- GraphQL codegen, Drizzle migration, and Tauri build scripts must go through the same env helper layer.
- Every app uses the same relative env and GraphQL autogen paths:
  - `<app>/env/*`
  - `<app>/src/config/env.ts`
  - `<app>/codegen.ts` when GraphQL codegen is used
  - `<app>/src/graphql/autogen.ts`

Read `references/env-policy.md` when creating files, scripts, or package layout that touches environment variables.

## GraphQL Codegen Contract

When GraphQL is selected:

- Each app that consumes or emits GraphQL owns `<app>/codegen.ts`.
- API schema output or schema source stays under `apps/api/src/graphql/`, commonly `schema.graphql`.
- Frontend or desktop operation documents stay near the owning feature in `src/features/<domain>/graphql`.
- Generated TypeScript is imported through `<app>/src/graphql/autogen.ts`.
- Choose one generated artifact policy per repo: ignored and reproducible, or committed and reviewed.
- Wire `codegen` into app scripts and `turbo` tasks for monorepos.

## Structure Workflow

1. Identify project kind with the numeric menu if unclear.
2. Confirm stack choices only where the default may not fit the selected kind.
3. Select the closest reference:
   - `references/frontend-next.md` for Next.js web apps.
   - `references/backend-nest.md` for NestJS APIs.
   - `references/monorepo.md` for full-stack monorepos.
   - `references/desktop-tauri.md` for Tauri apps.
   - `references/structure-validation.md` before final verification.
4. Produce a directory tree first.
5. Explain the boundaries between app, feature/domain, provider, shared package, generated files, and scripts.
6. Minimize duplicate folder roles. Do not create both global and domain folders for the same responsibility unless the boundary is explicit.
7. If editing a repo, inspect existing folders before changing anything and preserve user code.
8. Add or update env/codegen/migration/build scripts only when they match the selected project kind.
9. Verify the final tree against the selected folder rules before calling it done.
10. Run targeted validation when a repo has scripts for typecheck, lint, tests, codegen, or migrations.

## Web App Policy

For Next.js apps, prefer a hybrid route plus domain layout:

- `src/app` owns route segments, layouts, loading, error, and thin orchestration.
- `src/features/<domain>` owns domain UI, hooks, GraphQL documents, prefetch/data loaders, state, and domain types.
- `src/components` is only for shared UI that is not domain-specific.
- `src/providers` owns app-wide provider composition.
- `src/graphql` owns shared GraphQL client setup and the app-owned `autogen.ts` entrypoint.
- `src/config/env.ts` owns app-local Zod env parsing.
- `panda.config.ts`, app-wide tokens, recipes, reset, and generated style output must have explicit locations.
- Unit and component tests should be colocated with the source they verify; browser e2e tests belong in the app-level `test/e2e` folder.

Read `references/frontend-next.md` before generating a web structure.

## Backend Policy

For NestJS APIs, preserve the proven separation of common, modules, and providers, but adapt it to GraphQL:

- Use `modules`, not `module`, for domain modules.
- Use GraphQL `resolver` files by default; REST `controller` files only when REST is selected.
- Keep cross-cutting Nest pieces in `common`.
- Keep external service integrations in `providers`.
- Use Zod env parsing in `src/config`, not ad hoc config reads.
- Put Drizzle schema and migrations in `packages/db` for monorepos.
- Keep GraphQL generated artifacts behind `src/graphql/autogen.ts`, the same relative path used by web apps.
- Include API logging and cache as first-class boundaries:
  - `src/providers/logger` owns structured app/request logging setup.
  - `src/providers/cache` owns cache abstraction.
  - In monorepos, `packages/db/src/redis` owns Redis-specific client, key, and connection helpers.
  - In backend-only repos, `src/providers/cache/redis` is acceptable only when there is no shared DB package.
- Validate logger and cache env values in `src/config/env.ts`; modules must not read logger/cache env directly.
- Include `src/modules/health` when the API needs liveness/readiness checks.
- Put metrics, tracing, and error reporting adapters in `src/providers/observability` when used.
- Keep auth/security boundaries explicit: auth domain in `modules/auth`, guards/pipes/plugins in `common`, and JWT/cookie/password adapters in `providers`.

Read `references/backend-nest.md` before generating a backend structure.

## Verification Checklist

Before calling a structure done, verify:

- The final tree matches the selected project kind and does not include unused app types.
- App env paths are consistent: `<app>/env/*` and `<app>/src/config/env.ts`.
- GraphQL apps share `<app>/codegen.ts` and `<app>/src/graphql/autogen.ts`.
- Drizzle migrations have one owner and do not duplicate between `drizzle/` and `src/migrations/`.
- Redis is in `packages/db/src/redis` for monorepos and only wrapped by API cache providers.
- Frontend UI/CSS, backend security, observability, health, and test folders are represented when selected.
- Desktop apps include Tauri build env handling and the same env/codegen path shape when GraphQL is used.

## Output Shape

When answering, return:

1. Chosen project kind and stack assumptions.
2. Directory tree.
3. Boundary rules for the main folders.
4. Env/codegen/migration/build script policy.
5. Folder rule verification result.
6. Any project-specific questions that remain.

Keep the answer implementation-ready. Avoid broad architecture essays unless the user explicitly asks for a design discussion.
