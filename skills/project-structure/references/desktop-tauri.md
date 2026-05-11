# Desktop Tauri Structure

Use this reference for `4. Desktop app`.

## Default Tree

```text
apps/desktop/
  env/
    .env.example
    .env.development
    .env.test
    .env.production
  src/
    app/
    components/
    config/
      env.ts
    features/
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
```

## Rules

- Use Tauri by default for desktop apps.
- Ask whether the UI shell is Vite React or another supported frontend if it is not specified.
- Keep frontend env parsing in `src/config/env.ts`.
- Keep Tauri build-time env loading in `scripts/tauri-env.ts` or an equivalent explicit build script.
- Do not let Rust-side config and frontend config drift silently.
- Shared packages used by desktop apps still must not read `process.env` directly.

## Build Policy

Tauri build scripts should go through `packages/config` helpers, then pass only the required build-time values to Tauri.

Runtime secrets should not be bundled into frontend assets.
