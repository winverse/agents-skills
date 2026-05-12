# Frontend Next.js Structure

Use this reference for `1. Frontend web` and the web app inside `3. Full-stack monorepo`.

## Default Tree

```text
apps/web/
  codegen.ts
  panda.config.ts
  env/
    .env.example
    .env.development
    .env.test
    .env.stage
    .env.production
  styled-system/
    css/
    patterns/
    recipes/
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
        primitives/
        recipes/
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
      autogen.ts
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
      tokens.ts
      recipes.ts
    middleware.ts
  test/
    e2e/
      home.spec.ts
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
- The app-owned GraphQL generated entrypoint should stay at `src/graphql/autogen.ts`, the same relative path used by the API app.
- Use a shared `packages/graphql` only when more than one app consumes the same generated artifacts.
- App env files stay in app-root `env/`; the Zod schema stays in `src/config/env.ts`.
- `panda.config.ts` belongs at the app root unless the repo already centralizes Panda config.
- Panda generated output, commonly `styled-system/`, must have an explicit commit/ignore policy.
- App-level browser e2e tests belong in `apps/web/test/e2e`; unit and component tests stay next to the source they verify.

## Borrowed Patterns Worth Keeping

The user's existing `apps/web` style has useful patterns to carry forward:

- app route groups and route-specific layouts,
- colocated component files with test and index entry,
- app-level `providers`,
- `prefetch` functions separated from route files,
- `codegen.ts` and `src/graphql/autogen.ts`,
- local app `env/` folder and Zod-validated `src/config/env.ts`,
- Panda CSS config, tokens, recipes, and generated style output,
- scripts for generating components or SVG components.

## GraphQL Client Policy

- Use `urql` by default.
- Keep GraphQL documents near the feature that owns them.
- Run GraphQL Code Generator after schema or document changes.
- Keep the app-owned generated entrypoint in `src/graphql/autogen.ts`, the same relative path used by the API app.
- Generated files are source artifacts only when the project policy requires committed generated code; otherwise keep them ignored and reproducible.

## CSS/UI Policy

- Use Panda CSS by default.
- Use Ark UI or Park UI style headless primitives for reusable UI.
- Put app-neutral headless wrappers in `src/components/ui/primitives`.
- Put shared visual recipes in `src/components/ui/recipes` or `src/styles/recipes.ts`; choose one and avoid duplication.
- Keep domain-specific styling with the feature.
- Keep app-wide tokens, reset, and global styles in `src/styles` or the Panda config layer.

## Testing Policy

- Co-locate unit or component tests as `*.test.ts` or `*.test.tsx`.
- Keep browser e2e tests in `apps/web/test/e2e`.
- When GraphQL documents change, run web codegen before typecheck.
