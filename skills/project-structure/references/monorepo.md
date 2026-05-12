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
    drizzle/    # PostgreSQL only
    scripts/
    src/
      postgres/ # PostgreSQL only
      mongo/    # MongoDB only
      schema/   # PostgreSQL schema only
      redis/
  graphql/    # optional: shared generated artifacts for multiple consuming apps
  ui/
  tsconfig/
  eslint-config/

tooling/
  scripts/

docker/       # optional: local-only service composition when infra is selected
infra/        # optional: Pulumi AWS infrastructure when deployment is selected

turbo.json
package.json
bun.lock
```

## Package Roles

| Package | Role |
| --- | --- |
| `packages/config` | Env loading helpers, Zod helper utilities, env mode normalization |
| `packages/db` | Selected DB clients and schema/index helpers, PostgreSQL Drizzle migrations, MongoDB collection/index helpers, Redis client/key helpers, seed scripts |
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
- `packages/db` may expose tooling functions, PostgreSQL helpers, MongoDB helpers, and Redis helpers, but scripts must load env explicitly through config helpers.
- Redis belongs in `packages/db/src/redis` for monorepos. API apps should wrap it through `apps/api/src/providers/cache`, not define Redis key/client conventions inside app modules.
- Drizzle migration SQL and metadata belong in `packages/db/drizzle`; migration and seed commands belong in `packages/db/scripts`.
- Do not duplicate migration files in both `packages/db/drizzle` and `packages/db/src/migrations`.
- MongoDB projects use `packages/db/src/mongo` for MongoDB client, collection, and index helpers. They do not create Drizzle migration folders.
- Supabase Postgres keeps the PostgreSQL + Drizzle layout and may add Supabase-specific provider adapters only for selected Supabase platform features.
- GraphQL Code Generator should be wired into `turbo` tasks.
- Generated artifacts must have a clear policy: either committed and reviewed, or ignored and reproducible.
- Web e2e, API e2e, DB migration checks, and GraphQL codegen should be independently runnable through `turbo`.
- Infrastructure is optional. When deployment is selected, use `infra/pulumi` for Pulumi AWS code and app-local Dockerfiles for container builds.
- AWS ECR owns container image repositories. CI/CD should build Docker images, push immutable tags to ECR, and pass the selected tag to Pulumi.
- Choose one active AWS runtime path: ECS Fargate by default for new container runtimes, or EC2 Docker host when VM-level control is required.
- Local Docker Compose belongs in `docker/` or `docker-compose.yml` and must not be described as the production runtime.
- Public AWS services use an ALB by default. Route 53 and ACM belong in `infra/pulumi` only when a custom domain or TLS certificate is selected.
- Project setup should include stack config examples, required secret names, and a deployed smoke check when infrastructure is selected.

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
  "db:migrate": "bun --cwd packages/db run migrate",
  "db:shell": "bun --cwd packages/db run shell",
  "infra:preview": "bun --cwd infra/pulumi run preview",
  "infra:deploy": "bun --cwd infra/pulumi run deploy",
  "deploy:smoke": "bun --cwd infra/pulumi run smoke"
}
```

Use exact commands from the actual repo when editing an existing project.

## Generated Artifact Policy

Pick one policy per repo and state it in the root README or agent instructions:

- ignored and reproducible: generated GraphQL and Panda outputs are rebuilt by scripts and CI,
- committed and reviewed: generated outputs are committed, reviewed, and refreshed whenever schema, document, or token sources change.

## Infrastructure Add-On

Read `infra-pulumi-aws.md` before adding the optional `infra/` and `docker/` folders. Keep application structure and infrastructure structure separate:

- `apps/*` owns runtime source, app env schema, tests, and Docker build context.
- `packages/*` owns reusable code, database schema or MongoDB index helpers, Redis helpers, generated shared artifacts, and tooling config.
- `infra/pulumi` owns AWS infrastructure, stack config, ECR repositories, ECS/EC2 runtime resources, load balancer, IAM, logs, and deployment wiring.
