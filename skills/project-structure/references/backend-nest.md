# Backend NestJS Structure

Use this reference for `2. Backend API` and the API app inside `3. Full-stack monorepo`.

Even for a standalone backend project, default to `apps/api` unless the user or existing repo clearly wants the NestJS app at the repository root.

## Default Tree

```text
apps/api/
  codegen.ts
  env/
    .env.example
    .env.development
    .env.test
    .env.stage
    .env.production
  src/
    main.ts
    app.module.ts
    config/
      env.ts
      config.module.ts
      config.service.ts
    common/
      decorators/
      filters/
      guards/
        auth.guard.ts
        roles.guard.ts
      interceptors/
        request-logging.interceptor.ts
      pipes/
        zod-validation.pipe.ts
      plugins/
        cors.plugin.ts
        rate-limit.plugin.ts
      scalars/
    graphql/
      context.ts
      graphql.module.ts
      autogen.ts
    modules/
      auth/
        auth.module.ts
        auth.resolver.ts
        auth.service.ts
        auth.input.ts
        auth.model.ts
      users/
        users.module.ts
        users.resolver.ts
        users.service.ts
        users.repository.ts
        users.input.ts
        users.model.ts
      health/
        health.module.ts
        health.resolver.ts
        health.service.ts
    providers/
      cache/
        cache.module.ts
        cache.service.ts
      cookie/
      jwt/
      logger/
        logger.module.ts
        logger.service.ts
      mail/
      observability/
        metrics.service.ts
        tracing.service.ts
      password/
      storage/
  test/
    app.e2e-spec.ts
```

## Rules

- Use NestJS with the Fastify adapter by default.
- Use GraphQL resolver files by default.
- Use REST controllers only when the user selects REST.
- Put cross-cutting Nest primitives in `common`.
- Put business domains in `modules`.
- Put external integrations and platform services in `providers`.
- Put structured logging in `providers/logger`.
- Put cache behind `providers/cache`; in monorepos, keep Redis client/key/connection details inside `packages/db/src/redis`.
- Use `providers/cache/redis` only for backend-only repos without a shared DB package.
- Keep app env parsing in `src/config/env.ts`.
- Wrap parsed env in injectable config modules/services only after Zod validation.
- App env files stay in app-root `env/`; the Zod schema stays in `src/config/env.ts`.
- Keep the API-owned GraphQL generated entrypoint in `src/graphql/autogen.ts`, the same relative path used by the web app.
- Unit tests may be colocated with source files; e2e tests belong in `apps/api/test`.
- Put liveness/readiness checks in `modules/health` when the API needs deployment health checks.
- Keep metrics, tracing, and error reporting adapters in `providers/observability`.
- Keep auth domain logic in `modules/auth`; keep reusable guards, pipes, and Fastify plugins in `common`.
- Keep JWT, cookie/session, password hashing, and external identity adapters in `providers`.

## Logger And Cache Policy

- `providers/logger` owns logger module setup, logger service binding, log level, and request logging integration.
- `common/interceptors/request-logging.interceptor.ts` may use the logger provider, but should not configure it.
- `providers/cache` exposes app-level cache services or interfaces.
- In monorepos, `packages/db/src/redis` owns Redis client creation, Redis key builders, and Redis-specific connection helpers.
- `providers/cache` may wrap the Redis client from `packages/db`, but it should not define Redis schema/key conventions itself.
- Domain modules depend on cache/logger services, not Redis clients or raw logger libraries directly.
- `src/config/env.ts` validates logger and cache env values before providers are constructed.

Recommended API env keys:

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

`REDIS_URL` and cache settings may be optional only when the selected project explicitly disables Redis-backed cache. `packages/db` must receive validated values from the app or tooling entrypoint; it should not read `process.env` directly.

## Backend Style To Carry Forward

From the user's existing NestJS REST API style, keep:

- a clear `common` layer for filters, guards, helpers, interfaces, and plugins,
- a domain module layer for auth, users, posts, and other business domains,
- a provider layer for jwt, cookie, logger, cache, config, database, and utility integrations,
- `main.ts` bootstrapping through Fastify,
- health/readiness checks that do not leak domain logic,
- explicit CORS/rate-limit/cookie plugins instead of hidden bootstrap code,
- e2e tests separated from unit tests.

Modernize these pieces for the default stack:

- `src/module` becomes `src/modules`.
- REST `controller` becomes GraphQL `resolver` unless REST is selected.
- Prisma-specific folders become Drizzle-aware DB boundaries.
- Joi/default config files become Zod app-local env parsing.

## Database Boundary

For monorepos, prefer:

```text
packages/db/
  drizzle/
    meta/
    *.sql
  src/
    client.ts
    redis/
      client.ts
      connection.ts
      keys.ts
    schema/
  scripts/
    migrate.ts
    seed.ts
```

The API app imports the database package. It should not duplicate relational schema or Redis key/client definitions in `apps/api`.

Use `drizzle/` for migration SQL output and metadata. Use `scripts/migrate.ts` or package scripts for migration execution. Do not also create a source-tree migrations folder for the same migration files.

For a backend-only repo, `src/db` or `src/providers/cache/redis` is acceptable, but still keep DB/cache boundaries explicit and avoid scattering Redis access through domain modules.

## GraphQL Codegen Policy

- API schema output or schema source stays under `apps/api/src/graphql`, commonly `schema.graphql`.
- API generated TypeScript should be reachable only through `src/graphql/autogen.ts`.
- Resolver and model files stay in `src/modules/<domain>`.
- Run API codegen after schema-affecting model, input, resolver, or scalar changes.
