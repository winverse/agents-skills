# Backend NestJS Structure

Use this reference for `2. Backend API` and the API app inside `3. Full-stack monorepo`.

## Default Tree

```text
apps/api/
  env/
    .env.example
    .env.development
    .env.test
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
      pipes/
      plugins/
      scalars/
    graphql/
      context.ts
      graphql.module.ts
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
      jwt/
      logger/
      mail/
      redis/
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
- Keep app env parsing in `src/config/env.ts`.
- Wrap parsed env in injectable config modules/services only after Zod validation.
- Unit tests may be colocated with source files; e2e tests belong in `apps/api/test`.

## Backend Style To Carry Forward

From the user's existing NestJS REST API style, keep:

- a clear `common` layer for filters, guards, helpers, interfaces, and plugins,
- a domain module layer for auth, users, posts, and other business domains,
- a provider layer for jwt, cookie, logger, config, database, and utility integrations,
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
