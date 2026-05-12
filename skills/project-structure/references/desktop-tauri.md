# Desktop Tauri Structure

Use this reference for `4. Desktop app`.

## Default Tree

```text
apps/desktop/
  codegen.ts
  env/
    .env.example
    .env.development
    .env.test
    .env.stage
    .env.production
  src/
    app/
    components/
    config/
      env.ts
    features/
      settings/
        components/
        graphql/
        hooks/
    graphql/
      client.ts
      autogen.ts
    lib/
    providers/
  src-tauri/
    capabilities/
    icons/
    src/
      main.rs
    tauri.conf.json
  scripts/
    tauri-env.ts
  test/
    e2e/
```

## Rules

- Use Tauri by default for desktop apps.
- Ask whether the UI shell is Vite React or another supported frontend if it is not specified.
- Keep frontend env parsing in `src/config/env.ts`.
- Keep Tauri build-time env loading in `scripts/tauri-env.ts` or an equivalent explicit build script.
- If the desktop app consumes GraphQL, keep `codegen.ts` at the app root and generated TypeScript behind `src/graphql/autogen.ts`.
- Keep desktop feature GraphQL documents near the feature, such as `src/features/<domain>/graphql`.
- Do not let Rust-side config and frontend config drift silently.
- Shared packages used by desktop apps still must not read `process.env` directly.
- Keep desktop e2e or smoke tests in `apps/desktop/test/e2e` when the project has desktop test automation.

## Build Policy

Tauri build scripts should go through `packages/config` helpers, then pass only the required build-time values to Tauri.

Runtime secrets should not be bundled into frontend assets.

Use the same env modes as web and API apps:

```text
.env.example
.env.development
.env.test
.env.stage
.env.production
```

## Desktop Boundary

- `src/` owns the frontend app shell and app-local env parsing.
- `src-tauri/` owns Rust commands, capabilities, icons, and Tauri config.
- `scripts/tauri-env.ts` bridges validated build-time env into the Tauri build.
- Shared packages receive validated values from the app or build script; they do not read `process.env`.
