## Project Skill: Project Structure

- For choosing, creating, standardizing, or refactoring frontend, backend, full-stack monorepo, or desktop app folder structures, use the shared skill at `<skills-root>/skills/project-structure/SKILL.md`.

## Project Structure Overrides

- Prefer numeric choices when the project kind or stack is not clear.
- Default to Bun, Turborepo, Next.js, NestJS with Fastify, GraphQL, urql, GraphQL Code Generator, PostgreSQL, Drizzle, Panda CSS with headless UI, Tauri, and Zod env validation unless the project says otherwise.
- Use app-local env schemas and keep `packages/config` as helper-only. Shared packages must not read `process.env` directly.
