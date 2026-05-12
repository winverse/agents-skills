# Database Options

Use this reference when the selected structure changes the database choice, database hosting, psql workflow, or managed database provider.

## Database Menu

Ask only when the answer changes the tree:

```text
DB: 1 PostgreSQL + Drizzle default, 2 MongoDB + Atlas, 3 Supabase Postgres, 4 no DB, 5 external DB
Postgres hosting: 1 app-managed Postgres default, 2 Supabase managed Postgres, 3 existing Postgres
Mongo hosting: 1 MongoDB Atlas default for MongoDB, 2 self-hosted MongoDB, 3 existing MongoDB
DB shell: 1 psql for PostgreSQL/Supabase, 2 mongosh for MongoDB, 3 no shell script
```

## PostgreSQL Default

Use PostgreSQL + Drizzle when the user asks for SQL, relational data, psql, Supabase, RDS-like managed Postgres, joins, transactions, reporting, or the project has no DB preference.

Recommended monorepo shape:

```text
packages/db/
  drizzle/
    meta/
    *.sql
  src/
    postgres/
      client.ts
      connection.ts
    schema/
  scripts/
    migrate.ts
    seed.ts
    psql.ts
```

Rules:

- Drizzle migration SQL and metadata live in `packages/db/drizzle`.
- Migration, seed, and optional psql shell helpers live in `packages/db/scripts`.
- Use `DATABASE_URL` for app runtime and migration only when the selected provider supports it safely.
- If pooled and direct connections differ, use a separate direct migration variable such as `DATABASE_DIRECT_URL`.
- Do not duplicate migration files under `src/migrations`.

## Supabase Postgres

Treat Supabase as managed PostgreSQL unless the user explicitly asks for Supabase Auth, Storage, Realtime, or Edge Functions.

Recommended additions:

```text
packages/db/
  src/
    postgres/
      supabase.ts        # optional provider adapter for Supabase-specific features
  scripts/
    psql.ts              # psql helper using validated env

apps/api/src/providers/supabase/
  supabase-admin.ts      # only when service-role server operations are selected
```

Rules:

- Keep Drizzle and PostgreSQL schema ownership in `packages/db`.
- Keep `SUPABASE_SERVICE_ROLE_KEY` server-only. Never expose it through frontend public env.
- Use frontend public Supabase keys only when the frontend actually uses Supabase client features.
- Prefer psql-compatible connection strings for database shell and migration workflows.
- If Supabase pooler and direct database URLs are both needed, document which one powers runtime and which one powers migrations or psql.

Typical env names:

```text
DATABASE_URL
DATABASE_DIRECT_URL
SUPABASE_URL
SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
```

## MongoDB Atlas

Use MongoDB + Atlas when the user asks for MongoDB, document database, Atlas, collections, flexible document schema, or existing MongoDB data.

Recommended monorepo shape:

```text
packages/db/
  src/
    mongo/
      client.ts
      connection.ts
      collections/
      indexes/
  scripts/
    seed.ts
    sync-indexes.ts
    mongosh.ts
```

Rules:

- Do not create Drizzle migrations for MongoDB.
- Put MongoDB connection creation and collection/index helpers under `packages/db/src/mongo`.
- Domain modules should depend on repositories/services, not raw MongoDB clients.
- Use MongoDB Atlas as an external managed data platform by default.
- For AWS infrastructure, Pulumi may consume Atlas connection and network outputs, but should not provision Atlas resources unless the user explicitly asks to manage Atlas with Pulumi.
- Document Atlas network access, private endpoint or IP allowlist assumptions, database user names, and required secret names.

Typical env names:

```text
MONGODB_URI
MONGODB_DB_NAME
MONGODB_APP_NAME
```

## Backend Boundary

For NestJS APIs:

- Keep database client factories in `packages/db` for monorepos.
- Keep app provider wrappers in `apps/api/src/providers/database` only when the app needs injectable Nest providers.
- Keep domain repository files in `src/modules/<domain>` when they express domain queries.
- Do not scatter raw `MongoClient`, `pg`, Drizzle clients, or Supabase admin clients through resolvers.
