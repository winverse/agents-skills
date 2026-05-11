# Env Policy

Use this policy for all project structures created or revised with `project-structure`.

## Core Rules

- Each deployable app owns its own env schema.
- Every env schema uses Zod.
- Every app has its own env files.
- `packages/config` provides reusable helpers only.
- Frontend public env and server-only env are separated.
- Shared packages never read `process.env` directly.
- Tooling entrypoints for GraphQL codegen, Drizzle migration, and Tauri build use the same helper layer as apps.
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
- Tauri build: load desktop env, then produce build-time config.

Do not let these scripts independently parse random `.env` files.

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
```

Do not let `providers/logger`, `providers/cache`, or `providers/cache/redis` read `process.env` directly.

## Naming

Prefer `APP_ENV` or `DEPLOY_ENV` for new projects.

`DOCKER_ENV` may be accepted as a compatibility alias in projects that already use it, but do not make it the primary name for new templates.
