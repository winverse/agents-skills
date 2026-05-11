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

## Structure Workflow

1. Identify project kind with the numeric menu if unclear.
2. Confirm stack choices only where the default may not fit the selected kind.
3. Select the closest reference:
   - `references/frontend-next.md` for Next.js web apps.
   - `references/backend-nest.md` for NestJS APIs.
   - `references/monorepo.md` for full-stack monorepos.
   - `references/desktop-tauri.md` for Tauri apps.
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

Read `references/backend-nest.md` before generating a backend structure.

## Output Shape

When answering, return:

1. Chosen project kind and stack assumptions.
2. Directory tree.
3. Boundary rules for the main folders.
4. Env/codegen/migration/build script policy.
5. Folder rule verification result.
6. Any project-specific questions that remain.

Keep the answer implementation-ready. Avoid broad architecture essays unless the user explicitly asks for a design discussion.
