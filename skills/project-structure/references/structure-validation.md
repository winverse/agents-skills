# Structure Validation

Use this reference before presenting the final project tree or before finishing a repo refactor.

## Final Tree Checklist

- The tree matches the selected kind: frontend web, backend API, full-stack monorepo, or desktop app.
- The tree does not include unused app types just because they exist in the default examples.
- Folder roles are not duplicated. If both global and domain folders exist for the same concern, the boundary is stated.
- Each deployable app has `<app>/env/*` and `<app>/src/config/env.ts`.
- GraphQL apps have `<app>/codegen.ts` and `<app>/src/graphql/autogen.ts`.
- GraphQL schema source/output stays under `apps/api/src/graphql` for API apps.
- GraphQL operation documents stay near the owning feature in `src/features/<domain>/graphql`.
- Drizzle migration files have one owner, usually `packages/db/drizzle`.
- Migration and seed execution scripts live in `packages/db/scripts` or an explicitly named app-local scripts folder.
- PostgreSQL and Supabase Postgres structures include psql or migration helper boundaries when selected.
- MongoDB structures include `packages/db/src/mongo`, collection/index helpers, seed/index sync scripts, and no Drizzle migration folder unless PostgreSQL is also selected.
- Supabase service-role keys, MongoDB URIs, and direct database URLs are server-only and not exposed through frontend public env.
- Tool and automation boundaries are explicit: agent tools, MCP servers, external API clients, database shells, deploy scripts, migrations, destructive commands, and account-changing actions have named owners and approval expectations.
- Eval fixtures, screenshots, logs, and examples are scrubbed of live credentials, private data, and production identifiers.
- Folder-local AGENTS.md indexes exist for selected boundary folders, stay short, and list purpose, local map, editable areas, do-not-touch areas, related skills, and validation commands.
- Monorepo Redis client, key, and connection helpers live in `packages/db/src/redis`.
- API cache providers wrap Redis helpers and do not define Redis key conventions.
- Frontend UI/CSS structure includes Panda config, token/recipe location, and generated style output policy when Panda is selected.
- Backend security structure includes auth domain, guards, validation pipes, CORS/rate-limit/cookie plugins, and provider adapters when those capabilities are selected.
- Backend observability includes logger, request logging, health/readiness, and optional metrics/tracing boundaries when needed.
- Unit and component tests are colocated; e2e tests live in each app's `test/e2e` or API `test` folder.
- Desktop apps include `src-tauri`, `scripts/tauri-env.ts`, `.env.stage`, and the same GraphQL codegen paths when GraphQL is selected.
- Infrastructure-aware repos include app-local Dockerfiles and `.dockerignore`, `infra/pulumi`, Pulumi stack files or examples, ECR image ownership, public entrypoint choice, CI/CD image tag handoff, documented required secret names, deployed smoke checks, and exactly one active AWS runtime path: ECS Fargate or EC2 Docker host.
- Local Docker Compose, when present, is labeled local-only and not the production runtime.

## Validation Commands

When the repo provides scripts, run only the relevant ones:

```text
bun run typecheck
bun run lint
bun run test
bun run test:e2e
bun run codegen
bun run db:check
bun run db:migrate
bun run db:shell
bun run infra:preview
bun run infra:deploy
bun run deploy:smoke
```

Use the actual script names from the target repo. Do not invent commands as if they were already installed.
