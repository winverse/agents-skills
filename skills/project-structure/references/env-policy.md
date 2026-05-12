# Env Policy

Use this policy for all project structures created or revised with `project-structure`.

## Core Rules

- Each deployable app owns its own env schema.
- Every env schema uses Zod.
- Every app has its own env files.
- `packages/config` provides reusable helpers only.
- Frontend public env and server-only env are separated.
- Shared packages never read `process.env` directly.
- Tooling entrypoints for GraphQL codegen, Drizzle migration, Tauri build, and infrastructure deploy scripts use the same helper layer as apps when they need application env values.
- Every app uses the same relative env shape: `<app>/env/*` for files and `<app>/src/config/env.ts` for the Zod schema.

## Recommended Files

```text
packages/config/
  src/
    env-mode.ts
    load-env.ts
    zod-helpers.ts
    public-env.ts
    index.ts

apps/web/
  env/
    .env.example
    .env.development
    .env.test
    .env.stage
    .env.production
  src/config/env.ts

apps/api/
  env/
    .env.example
    .env.development
    .env.test
    .env.stage
    .env.production
  src/config/env.ts

apps/desktop/
  env/
    .env.example
    .env.development
    .env.test
    .env.stage
    .env.production
  src/config/env.ts
```

Do not move one app's env files under `src/` while another app keeps them at app root. The app root `env/` folder is the default for every deployable app.

## Helper Boundary

`packages/config` may:

- select the current env mode,
- load an app-specific env file,
- provide Zod helper functions,
- normalize booleans, numbers, URLs, and ports,
- provide shared `AppEnv` or `DeployEnv` enums.

`packages/config` must not:

- define app-specific required variables,
- export a global env object for all apps,
- read `process.env` on behalf of a shared package at import time,
- hide whether a value is public or server-only.

## App Env Boundary

Each app should expose a parsed env object from its own source tree.

```text
apps/web/src/config/env.ts
apps/api/src/config/env.ts
apps/desktop/src/config/env.ts
```

Frontend apps must split values:

```text
serverEnv  -> only available on the server
publicEnv  -> safe to expose to the browser
```

Use framework prefixes such as `NEXT_PUBLIC_` only for values intended for the browser.

## Tooling Entrypoints

Tooling scripts should call an explicit env loader before doing work:

- GraphQL codegen: load the selected app env, then write the app-owned generated entrypoint to `<app>/src/graphql/autogen.ts`.
- Drizzle migration: load DB-owning app or `packages/db` tooling env, then connect.
- psql shell: load validated PostgreSQL or Supabase Postgres env, then open the selected connection string.
- mongosh shell: load validated MongoDB Atlas or MongoDB env, then open the selected connection string.
- Tauri build: load desktop env, then produce build-time config.
- Infrastructure deploy: load app env only for application variables; load cloud values from Pulumi stack config.

Do not let these scripts independently parse random `.env` files.

## Infrastructure Env Boundary

When Pulumi AWS infrastructure is selected:

- App env schemas own application variables such as API URLs, public frontend values, server-only secrets, logging, cache, and database connection inputs.
- Pulumi stack config owns cloud values such as AWS region, account, image tag, runtime target, capacity, domain, certificate ARN, and load balancer settings.
- `Pulumi.<stack>.yaml.example` or equivalent docs may list required config keys, but must not contain live secret values.
- Deployment scripts may pass a selected immutable image tag from CI/CD to Pulumi, but should not rewrite app env schemas.

## API Logger And Cache Env

Backend apps should validate logger and cache settings in the app-local env schema before creating providers:

```text
apps/api/src/config/env.ts
```

Typical API keys:

```text
LOG_LEVEL
LOG_FORMAT
REDIS_URL
REDIS_TLS
CACHE_TTL_SECONDS
HEALTH_CHECK_TIMEOUT_MS
METRICS_ENABLED
TRACE_EXPORTER_URL
CORS_ORIGIN
RATE_LIMIT_MAX
```

## Database Env Boundary

PostgreSQL and Supabase Postgres typically use:

```text
DATABASE_URL
DATABASE_DIRECT_URL
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

MongoDB Atlas typically uses:

```text
MONGODB_URI
MONGODB_DB_NAME
MONGODB_APP_NAME
```

Rules:

- Keep `SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_DIRECT_URL`, and `MONGODB_URI` server-only.
- Use frontend-public Supabase env only when the frontend actually uses Supabase client features.
- For Supabase Postgres, document which connection string is for app runtime and which one is for migrations or psql.
- For MongoDB Atlas, document Atlas network access, private endpoint or IP allowlist assumptions, database user names, and required secret names.

Do not let `providers/logger`, `providers/cache`, or `packages/db/src/redis` read `process.env` directly. The app or tooling entrypoint loads env first, validates it, and passes the resulting Redis settings into the DB/cache helper.

## Naming

Prefer `APP_ENV` or `DEPLOY_ENV` for new projects.

`DOCKER_ENV` may be accepted as a compatibility alias in projects that already use it, but do not make it the primary name for new templates.

## GraphQL And Generated Artifacts

Every GraphQL app should use the same relative tooling shape:

```text
<app>/codegen.ts
<app>/src/graphql/autogen.ts
```

API schema output or schema source should stay under `apps/api/src/graphql`, commonly `schema.graphql`. Operation documents should stay near the owning feature, such as `src/features/<domain>/graphql`.

Choose one generated artifact policy per repo:

- ignored and reproducible,
- committed and reviewed.

Do not mix policies per app unless an existing repo already has that constraint and the exception is documented.
