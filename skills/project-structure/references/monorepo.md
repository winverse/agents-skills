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
  graphql/
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
- GraphQL Code Generator should be wired into `turbo` tasks.
- Generated artifacts must have a clear policy: either committed and reviewed, or ignored and reproducible.

## Suggested Scripts

```json
{
  "dev": "turbo dev",
  "build": "turbo build",
  "typecheck": "turbo typecheck",
  "lint": "turbo lint",
  "test": "turbo test",
  "codegen": "turbo codegen",
  "db:migrate": "bun --cwd packages/db run migrate"
}
```

Use exact commands from the actual repo when editing an existing project.
