---
name: project-structure
description: Use when a user asks to choose, create, standardize, or refactor a web, backend, full-stack monorepo, desktop app, or infrastructure-aware project folder structure. This skill asks compact numeric choices, applies the user's default stack preferences, and produces a consistent project layout with env, GraphQL codegen, Drizzle migration, Tauri build, Pulumi/Docker/AWS infrastructure, folder-local AGENTS.md indexes, testing, security, tool boundaries, health/readiness, and observability policies.
---

# Project Structure

Use this skill when the user asks how to structure a project, create a new project skeleton, align an existing repo to a consistent layout, or choose folders/stacks for frontend, backend, full-stack monorepo, desktop apps, or application infrastructure.

## First Move

If the request is still raw product discovery, end-to-end project workflow, domain modeling, PRD/issues, or “start a new project and take it through planning/implementation,” defer to `workflow` first. Use `project-structure` after the domain language and architecture questions are concrete enough to choose or validate folder/env/codegen/db/infra boundaries.

If the project kind is not already clear, ask a compact numeric choice:

```text
1. Frontend web
2. Backend API
3. Full-stack monorepo
4. Desktop app
```

Then ask only the stack choices that matter for that kind. Prefer defaults unless the user says otherwise.

For standalone frontend or backend projects, still use the same app-root convention (`apps/web` or `apps/api`) by default so env, codegen, tests, and future monorepo migration stay consistent. Use a repo-root app layout only when the user or existing repo clearly prefers it.

Use compact numeric menus, not long architecture questionnaires. Ask a menu only when the answer changes the tree:

```text
API contract: 1 GraphQL default, 2 REST, 3 hybrid
DB: 1 PostgreSQL + Drizzle default, 2 MongoDB + Atlas, 3 Supabase Postgres, 4 no DB, 5 external DB
Postgres hosting: 1 app-managed Postgres default, 2 Supabase managed Postgres, 3 existing Postgres
Mongo hosting: 1 MongoDB Atlas default for MongoDB, 2 self-hosted MongoDB, 3 existing MongoDB
DB shell: 1 psql for PostgreSQL/Supabase, 2 mongosh for MongoDB, 3 no shell script
Cache: 1 Redis through cache boundary default when cache/session is needed, 2 no Redis
Auth: 1 app-owned auth module default when auth is needed, 2 external auth, 3 no auth
Generated artifacts: 1 ignored and reproducible default, 2 committed and reviewed
Desktop shell: 1 Tauri + Vite React default, 2 Tauri + existing frontend shell
Infrastructure: 1 Pulumi AWS default when infra is requested, 2 no infra, 3 existing infra tool
Container registry: 1 Docker image to AWS ECR default when deploying containers, 2 no registry, 3 external registry
Runtime target: 1 ECS Fargate default for new AWS container runtime, 2 EC2 Docker host, 3 no cloud runtime
Public entrypoint: 1 ALB default for public AWS services, 2 internal service, 3 existing DNS/CDN
Folder instructions: 1 boundary AGENTS.md index default, 2 root AGENTS.md only, 3 existing instruction files
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
| Database | PostgreSQL by default, MongoDB Atlas or Supabase Postgres when selected |
| ORM/query layer | Drizzle for PostgreSQL, MongoDB driver/repository boundary for MongoDB |
| CSS/UI | Panda CSS with Ark UI or Park UI style headless components |
| Desktop | Tauri |
| Env validation | Zod |
| Infrastructure as Code | Pulumi |
| Container build | Docker |
| Cloud provider | AWS |
| Container registry | AWS ECR |
| Cloud runtime | ECS Fargate by default, EC2 when VM control is required |
| Public entrypoint | ALB, with Route 53 and ACM only when custom domain/TLS is requested |
| Folder instructions | Boundary-folder `AGENTS.md` table-of-contents indexes by default |
| Testing shape | colocated unit/component tests, app-level e2e tests |
| Observability | logger, request logging, health/readiness, metrics/tracing boundary |

Do not offer a full-stack single-repo layout by default. The preferred full-stack shape is a monorepo.

## Tool And Security Boundaries

When a structure includes agent tools, MCP servers, external APIs, cloud deploy automation, CI/CD, database shells, or write-capable scripts, make the boundary explicit in the tree and docs:

- Keep secret-bearing env values server-only and validate them through app-local Zod schemas.
- Put tool adapters, API clients, and automation scripts behind named provider or script folders instead of spreading direct calls through feature code.
- Document which commands can write, deploy, migrate, delete, send network requests, or touch production-like resources.
- Prefer least-privilege credentials, scoped directories, and explicit approval gates for destructive or account-changing actions.
- Keep eval fixtures, screenshots, logs, and examples scrubbed of real credentials and private data.

## Infrastructure Policy

Only include infrastructure folders when the user asks for deployment, cloud, Docker, Pulumi, AWS, ECR, ECS, EC2, CI/CD deploy shape, or production-ready structure.

When infrastructure is selected:

- Prefer Pulumi with TypeScript for AWS infrastructure.
- Prefer Docker images for deployable web/API apps that run in AWS.
- Prefer AWS ECR as the image registry.
- Prefer ECS Fargate for new container runtimes; choose EC2 when the user needs VM-level control, SSH workflows, persistent host customization, or non-container host processes.
- Keep app Dockerfiles next to the deployable app: `<app>/Dockerfile` and `<app>/.dockerignore`.
- Keep local-only service composition under `docker/` or `docker-compose.yml`; do not treat local Compose as the production runtime.
- Keep cloud infrastructure under `infra/pulumi` with stack files, TypeScript source, and deployment scripts.
- Pulumi owns network, IAM, ECR repositories, ECS services or EC2 hosts, load balancer, security groups, logs, and runtime wiring.
- Use an ALB for public AWS services; add Route 53 and ACM only when a custom domain or TLS certificate is selected.
- Keep exactly one active runtime implementation in a generated project tree. ECS Fargate is the default; EC2 Docker host replaces it when EC2 is selected.
- App env schemas still own application variables. Pulumi stack config owns infrastructure values such as AWS region, account, image tag, domain, capacity, and runtime target.
- Do not commit live secrets in Pulumi stack files. Use secret config providers or placeholders and document required secret names.
- CI/CD should build Docker images, push immutable tags to ECR, run `pulumi up` with the selected image tag or deployment config, and run a deployed smoke check against the selected health endpoint.

Read `references/infra-pulumi-aws.md` before generating Pulumi, Docker, AWS ECR, ECS, EC2, or deployment pipeline structure.

## Database Policy

Use PostgreSQL + Drizzle by default. Add MongoDB Atlas, Supabase Postgres, psql, or mongosh structure only when the user selects it or the existing repo already uses it.

When database choices are selected:

- PostgreSQL uses `packages/db/drizzle`, `packages/db/src/postgres`, and `packages/db/scripts` for migration, seed, and optional `psql` helpers.
- Supabase is treated as managed PostgreSQL for normal database access. Use Drizzle and psql-compatible connection strings; add Supabase-specific providers only for Auth, Storage, Realtime, Edge Functions, or service-role server operations.
- MongoDB uses `packages/db/src/mongo`, collection/index helpers, seed scripts, and optional `mongosh` helpers. Do not create Drizzle migrations for MongoDB.
- MongoDB Atlas is the default managed MongoDB provider. Document network access, private endpoint or IP allowlist assumptions, database user names, and required secret names.
- Do not expose Supabase service-role keys, MongoDB credentials, or direct database URLs through frontend public env.
- Keep domain modules behind repositories/services; resolvers should not directly use raw `MongoClient`, `pg`, Drizzle, or Supabase admin clients.

Read `references/db-options.md` before generating MongoDB, Atlas, Supabase, PostgreSQL hosting, psql, or database shell structure.

## Folder AGENTS Policy

Add folder-local `AGENTS.md` indexes for meaningful boundary folders by default. Treat them as table-of-contents and ownership maps, not long duplicate rulebooks.

When folder instructions are selected:

- Put a root `AGENTS.md` at the repo root for global project rules.
- Put local `AGENTS.md` files in boundary folders such as `apps/web`, `apps/api`, `apps/desktop`, `packages/db`, `packages/ui`, and `infra/pulumi` when those folders exist.
- Add deeper `AGENTS.md` files only when the subfolder has a different responsibility, validator, deployment unit, security boundary, or ownership model.
- Keep each folder `AGENTS.md` short and structured as a contents index: purpose, local map, editable areas, do-not-touch areas, relevant skills, and validation commands.
- Do not copy the full root instructions into every folder. Local files should point up to root rules and only add folder-specific guidance.
- Do not create folder-local `AGENTS.md` for generated output, vendored code, build artifacts, or trivial leaf folders.
- If the target agent uses `CLAUDE.md`, `.cursor/rules`, or another instruction surface, mirror the same folder-index idea in that agent's local instruction file rather than creating Codex-only guidance.

Read `references/folder-agents.md` before generating folder-local `AGENTS.md` indexes.

## Env Policy

Apply this policy to every generated or refactored structure:

- App-local env schema.
- Zod validation required.
- Env files per app.
- `packages/config` provides helpers only.
- Frontend public env and server env are separated.
- Shared packages never read `process.env` directly.
- GraphQL codegen, Drizzle migration, and Tauri build scripts must go through the same env helper layer.
- Infrastructure deploy scripts must use app env schemas for application variables and Pulumi stack config for cloud values.
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
   - `references/db-options.md` when MongoDB, Atlas, Supabase, PostgreSQL hosting, psql, or database shell choices are selected.
   - `references/folder-agents.md` when folder-local `AGENTS.md`, `CLAUDE.md`, or agent instruction indexes are selected.
   - `references/infra-pulumi-aws.md` when infrastructure, Docker, AWS, ECR, ECS, EC2, or deployment pipeline folders are selected.
   - `references/structure-validation.md` before final verification.
4. Produce a directory tree first.
5. Explain the boundaries between app, feature/domain, provider, shared package, generated files, and scripts.
6. Minimize duplicate folder roles. Do not create both global and domain folders for the same responsibility unless the boundary is explicit.
7. If editing a repo, inspect existing folders before changing anything and preserve user code.
8. Add or update env/codegen/migration/build/infra/deploy scripts only when they match the selected project kind.
9. Add or update boundary-folder `AGENTS.md` indexes when folder instructions are selected, and keep them aligned with the final tree.
10. Verify the final tree against the selected folder rules before calling it done.
11. Run targeted validation when a repo has scripts for typecheck, lint, tests, codegen, migrations, infrastructure preview, or deploy checks.

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
- Put selected database clients, schema/index definitions, and migration/seed scripts in `packages/db` for monorepos.
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
- MongoDB projects do not create Drizzle migrations and instead own collection/index helpers under `packages/db/src/mongo`.
- Supabase Postgres projects keep Drizzle/psql ownership in `packages/db` and keep Supabase service-role secrets server-only.
- Redis is in `packages/db/src/redis` for monorepos and only wrapped by API cache providers.
- Frontend UI/CSS, backend security, observability, health, and test folders are represented when selected.
- Desktop apps include Tauri build env handling and the same env/codegen path shape when GraphQL is used.
- Infrastructure-aware repos include Pulumi AWS structure, app-local Dockerfiles and `.dockerignore`, ECR image ownership, public entrypoint choice, documented secret names, smoke checks, and exactly one selected runtime path: ECS Fargate or EC2.
- Boundary folders include short `AGENTS.md` indexes when selected, and those indexes list purpose, local map, editable areas, do-not-touch areas, relevant skills, and validation commands.

## Output Shape

When answering, return:

1. Chosen project kind and stack assumptions.
2. Directory tree.
3. Boundary rules for the main folders.
4. Folder-local `AGENTS.md` index plan when selected.
5. Env/codegen/database/migration/build/infra/test/security/observability policy.
6. Folder rule verification result.
7. Any project-specific questions that remain.

Keep the answer implementation-ready. Avoid broad architecture essays unless the user explicitly asks for a design discussion.
