# Backend NestJS Structure

Use this reference for `2. Backend API` and the API app inside `3. Full-stack monorepo`.

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
      interceptors/
        request-logging.interceptor.ts
      pipes/
      plugins/
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
    providers/
      cache/
        cache.module.ts
        cache.service.ts
        redis/
      jwt/
      logger/
        logger.module.ts
        logger.service.ts
      mail/
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
- Put cache behind `providers/cache`; keep Redis details inside `providers/cache/redis`.
- Keep app env parsing in `src/config/env.ts`.
- Wrap parsed env in injectable config modules/services only after Zod validation.
- App env files stay in app-root `env/`; the Zod schema stays in `src/config/env.ts`.
- Keep the API-owned GraphQL generated entrypoint in `src/graphql/autogen.ts`, the same relative path used by the web app.
- Unit tests may be colocated with source files; e2e tests belong in `apps/api/test`.

## Logger And Cache Policy

- `providers/logger` owns logger module setup, logger service binding, log level, and request logging integration.
- `common/interceptors/request-logging.interceptor.ts` may use the logger provider, but should not configure it.
- `providers/cache` exposes app-level cache services or interfaces.
- `providers/cache/redis` owns Redis client creation, Redis options, and Redis-specific health checks.
- Domain modules depend on cache/logger services, not Redis clients or raw logger libraries directly.
- `src/config/env.ts` validates logger and cache env values before providers are constructed.

Recommended API env keys:

```text
LOG_LEVEL
LOG_FORMAT
REDIS_URL
REDIS_TLS
CACHE_TTL_SECONDS
```

`REDIS_URL` and cache settings may be optional only when the selected project explicitly disables Redis-backed cache.

## Backend Style To Carry Forward

From the user's existing NestJS REST API style, keep:

- a clear `common` layer for filters, guards, helpers, interfaces, and plugins,
- a domain module layer for auth, users, posts, and other business domains,
- a provider layer for jwt, cookie, logger, cache, config, database, and utility integrations,
- `main.ts` bootstrapping through Fastify,
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
  src/
    client.ts
    schema/
    migrations/
```

The API app imports the database package. It should not duplicate schema definitions in `apps/api`.

For a backend-only repo, `src/db` is acceptable, but still keep migrations and schema under one clear DB boundary.
