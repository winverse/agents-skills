# Folder AGENTS Indexes

Use this reference when a project structure should include folder-local agent instruction files such as `AGENTS.md`, `CLAUDE.md`, `.cursor/rules`, or another project-supported agent surface.

## Purpose

Folder-local `AGENTS.md` files are table-of-contents indexes for humans and agents. They explain what a folder owns and where to make changes. They are not copies of the root instruction file.

Use them for meaningful boundaries:

- deployable apps: `apps/web`, `apps/api`, `apps/desktop`
- shared packages: `packages/db`, `packages/ui`, `packages/config`, `packages/graphql`
- infrastructure roots: `infra/pulumi`
- workflow or docs roots when they have separate validation and ownership

Skip them for:

- generated folders such as `styled-system`, `dist`, `.next`, `coverage`, or GraphQL autogen output
- vendored code, fixture dumps, and build artifacts
- trivial leaf folders whose purpose is obvious from the parent index
- folders that would only duplicate the root `AGENTS.md`

## Default Placement

For a full-stack monorepo with infrastructure selected, show this shape:

```text
repo-root/
├── AGENTS.md
├── apps/
│   ├── web/
│   │   └── AGENTS.md
│   ├── api/
│   │   └── AGENTS.md
│   └── desktop/
│       └── AGENTS.md
├── packages/
│   ├── db/
│   │   └── AGENTS.md
│   ├── ui/
│   │   └── AGENTS.md
│   └── config/
│       └── AGENTS.md
└── infra/
    └── pulumi/
        └── AGENTS.md
```

For standalone frontend or backend projects that still use `apps/web` or `apps/api`, include root `AGENTS.md` and the app-level `AGENTS.md`.

## Contents Template

Keep each folder-local file concise:

```markdown
# <folder> Agent Index

## Purpose
- <what this folder owns>

## Local Map
- `<path>`: <short role>
- `<path>`: <short role>

## Work Here
- <changes that belong in this folder>

## Do Not Change Here
- <generated, shared, secret, or cross-boundary items>

## Related Skills
- `$project-structure`: <when to use>
- `$sync-docs`: <when to refresh this index>

## Validation
- `<command>`
```

## Folder-Specific Notes

- `apps/web/AGENTS.md`: list routes, feature folders, GraphQL document location, Panda CSS entrypoints, public/server env boundary, and browser e2e commands.
- `apps/api/AGENTS.md`: list modules, common Nest policies, providers, GraphQL schema/autogen boundary, health/readiness, security, logger, cache, and API test commands.
- `apps/desktop/AGENTS.md`: list Tauri shell, `src-tauri`, desktop env bridge, desktop GraphQL paths, and desktop build/test commands.
- `packages/db/AGENTS.md`: list PostgreSQL/Drizzle or MongoDB Atlas boundary, Redis boundary, migration/seed/shell scripts, and server-only secret handling.
- `packages/ui/AGENTS.md`: list shared primitives, style tokens, accessibility rules, and consumer app boundaries.
- `infra/pulumi/AGENTS.md`: list Pulumi stack files, AWS account/region config, ECR/image tag handoff, ECS or EC2 runtime path, required secret names, and preview/deploy/smoke commands.

## Sync Rules

- When the directory tree changes, update the nearest folder-local `AGENTS.md` index in the same change.
- When a boundary moves from one folder to another, update both the old and new folder indexes.
- When validator commands change, update every folder index that names that command.
- If folder indexes disagree with the root `AGENTS.md`, root rules win unless the local file explicitly narrows behavior for its folder.
