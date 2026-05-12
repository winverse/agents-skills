# Full-Stack Monorepo Structure

Use this reference for `3. Full-stack monorepo`.

## Default Tree

```text
apps/
  web/
  api/

packages/
  config/
  db/
    drizzle/
    scripts/
    src/
      schema/
      redis/
  graphql/    # optional: shared generated artifacts for multiple consuming apps
  ui/
  tsconfig/
  eslint-config/

tooling/
  scripts/

turbo.json
package.json
bun.lock
```

## Package Roles

| Package | Role |
| --- | --- |
| `packages/config` | Env loading helpers, Zod helper utilities, env mode normalization |
| `packages/db` | Drizzle schema, relational client factory, Redis client/key helpers, migrations, seed scripts |
| `packages/graphql` | Shared GraphQL schema artifacts or generated types when multiple apps consume them |
| `packages/ui` | App-neutral UI primitives only |
| `packages/tsconfig` | Shared TypeScript configs |
| `packages/eslint-config` | Shared lint config |

## Rules

- Deployable runtime code lives in `apps`.
- Reusable source code lives in `packages`.
- Shared packages do not read `process.env` directly.
- `apps/web` owns frontend env parsing.
- `apps/api` owns backend env parsing.
- `packages/db` may expose tooling functions, relational DB helpers, and Redis helpers, but scripts must load env explicitly through config helpers.
- Redis belongs in `packages/db/src/redis` for monorepos. API apps should wrap it through `apps/api/src/providers/cache`, not define Redis key/client conventions inside app modules.
- Drizzle migration SQL and metadata belong in `packages/db/drizzle`; migration and seed commands belong in `packages/db/scripts`.
- Do not duplicate migration files in both `packages/db/drizzle` and `packages/db/src/migrations`.
- GraphQL Code Generator should be wired into `turbo` tasks.
- Generated artifacts must have a clear policy: either committed and reviewed, or ignored and reproducible.
- Web e2e, API e2e, DB migration checks, and GraphQL codegen should be independently runnable through `turbo`.

## Suggested Scripts

```json
{
  "dev": "turbo dev",
  "build": "turbo build",
  "typecheck": "turbo typecheck",
  "lint": "turbo lint",
  "test": "turbo test",
  "test:e2e": "turbo test:e2e",
  "codegen": "turbo codegen",
  "db:check": "bun --cwd packages/db run check",
  "db:migrate": "bun --cwd packages/db run migrate"
}
```

Use exact commands from the actual repo when editing an existing project.

## Generated Artifact Policy

Pick one policy per repo and state it in the root README or agent instructions:

- ignored and reproducible: generated GraphQL and Panda outputs are rebuilt by scripts and CI,
- committed and reviewed: generated outputs are committed, reviewed, and refreshed whenever schema, document, or token sources change.
