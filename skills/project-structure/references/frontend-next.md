# Frontend Next.js Structure

Use this reference for `1. Frontend web` and the web app inside `3. Full-stack monorepo`.

## Default Tree

```text
apps/web/
  codegen.ts
  env/
    .env.example
    .env.development
    .env.test
    .env.production
  scripts/
    create-component.ts
    create-svg-component.ts
  src/
    app/
      layout.tsx
      page.tsx
      error.tsx
      not-found.tsx
    components/
      ui/
      layout/
    config/
      env.ts
    features/
      posts/
        components/
        graphql/
        hooks/
        prefetch/
        state/
        types.ts
      users/
        components/
        graphql/
        hooks/
        prefetch/
        state/
        types.ts
    graphql/
      client.ts
      cache.ts
      generated/
    hooks/
    lib/
      styles/
      utils.ts
    providers/
      CoreProvider.tsx
      GraphQLProvider.tsx
      ThemeProvider.tsx
    styles/
      global.css
      reset.css
    middleware.ts
```

## Rules

- `src/app` should stay thin: route composition, layouts, metadata, loading, error, and not-found handling.
- Domain-specific UI belongs in `src/features/<domain>/components`.
- Domain hooks belong in `src/features/<domain>/hooks`.
- Domain GraphQL documents belong in `src/features/<domain>/graphql`.
- Domain prefetch/data loading belongs in `src/features/<domain>/prefetch`.
- Global reusable UI belongs in `src/components`.
- Global reusable hooks belong in `src/hooks`.
- Global app providers belong in `src/providers`.
- GraphQL generated artifacts should stay in `src/graphql/generated` or a shared `packages/graphql` only when more than one app consumes them.

## Borrowed Patterns Worth Keeping

The user's existing `apps/web` style has useful patterns to carry forward:

- app route groups and route-specific layouts,
- colocated component files with test and index entry,
- app-level `providers`,
- `prefetch` functions separated from route files,
- `src/graphql` documents and `codegen.ts`,
- local app `env/` folder and Zod-validated `src/config/env.ts`,
- scripts for generating components or SVG components.

## GraphQL Client Policy

- Use `urql` by default.
- Keep GraphQL documents near the feature that owns them.
- Run GraphQL Code Generator after schema or document changes.
- Generated files are source artifacts only when the project policy requires committed generated code; otherwise keep them ignored and reproducible.

## CSS/UI Policy

- Use Panda CSS by default.
- Use Ark UI or Park UI style headless primitives for reusable UI.
- Keep domain-specific styling with the feature.
- Keep app-wide tokens, reset, and global styles in `src/styles` or the Panda config layer.
