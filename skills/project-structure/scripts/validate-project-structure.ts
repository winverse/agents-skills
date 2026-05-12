#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const root = path.resolve(process.argv[2] ?? "skills/project-structure");
const errors: string[] = [];

function read(relativePath: string): string {
  const filePath = path.join(root, relativePath);
  if (!existsSync(filePath)) {
    errors.push(`Missing file: ${relativePath}`);
    return "";
  }
  return readFileSync(filePath, "utf8");
}

const skill = read("SKILL.md");
const html = read("skill.html");
const envPolicy = read("references/env-policy.md");
const frontend = read("references/frontend-next.md");
const backend = read("references/backend-nest.md");
const monorepo = read("references/monorepo.md");
const desktop = read("references/desktop-tauri.md");
const structureValidation = read("references/structure-validation.md");
read("agents/openai.yaml");

const requiredSkillPhrases = [
  "Frontend web",
  "Backend API",
  "Full-stack monorepo",
  "Desktop app",
  "NestJS with Fastify adapter",
  "GraphQL Code Generator required",
  "Zod validation required",
  "`packages/config` provides helpers only",
  "Shared packages never read `process.env` directly",
  "Minimize duplicate folder roles",
  "Verify the final tree against the selected folder rules",
  "`<app>/src/graphql/autogen.ts`",
  "`src/providers/logger`",
  "`packages/db/src/redis`",
  "GraphQL Codegen Contract",
  "Testing shape",
  "health/readiness",
  "Verification Checklist",
];

for (const phrase of requiredSkillPhrases) {
  if (!skill.includes(phrase)) {
    errors.push(`SKILL.md missing required phrase: ${phrase}`);
  }
}

const requiredReferences = [
  "references/env-policy.md",
  "references/frontend-next.md",
  "references/backend-nest.md",
  "references/monorepo.md",
  "references/desktop-tauri.md",
  "references/structure-validation.md",
];

for (const reference of requiredReferences) {
  if (!skill.includes(reference)) {
    errors.push(`SKILL.md does not point to ${reference}`);
  }
}

const envRules = [
  "Each deployable app owns its own env schema",
  "Every env schema uses Zod",
  "`packages/config` provides reusable helpers only",
  "Shared packages never read `process.env` directly",
  "GraphQL codegen",
  "Drizzle migration",
  "Tauri build",
  "LOG_LEVEL",
  "REDIS_URL",
  "HEALTH_CHECK_TIMEOUT_MS",
  "METRICS_ENABLED",
  "CORS_ORIGIN",
  "RATE_LIMIT_MAX",
];

for (const rule of envRules) {
  if (!envPolicy.includes(rule)) {
    errors.push(`env-policy.md missing rule: ${rule}`);
  }
}

for (const [name, text, phrases] of [
  ["frontend-next.md", frontend, ["src/features/<domain>", "urql", "codegen.ts", "providers", "panda.config.ts", "styled-system", "test/e2e"]],
  ["backend-nest.md", backend, ["Fastify adapter", "resolver", "providers", "Drizzle", "providers/logger", "packages/db/src/redis", "modules/health", "providers/observability", "rate-limit.plugin.ts"]],
  ["monorepo.md", monorepo, ["packages/config", "packages/db", "packages/db/src/redis", "turbo", "codegen", "packages/db/drizzle", "packages/db/scripts"]],
  ["desktop-tauri.md", desktop, ["Tauri", "src-tauri", "tauri-env.ts", ".env.stage", "src/graphql/autogen.ts", "codegen.ts"]],
  ["structure-validation.md", structureValidation, ["Final Tree Checklist", "GraphQL apps have", "Drizzle migration files have one owner", "Backend observability", "Desktop apps include"]],
] as const) {
  for (const phrase of phrases) {
    if (!text.includes(phrase)) {
      errors.push(`${name} missing phrase: ${phrase}`);
    }
  }
}

const htmlRequired = [
  "Decision Matrix",
  "Wizard Flow",
  "Compact Menus",
  "Default Stack",
  "Folder Structure Trees",
  "Frontend web tree",
  "Backend API tree",
  "Full-stack monorepo package boundary",
  "Desktop app tree",
  "Env Contract",
  "GraphQL Codegen Contract",
  "Structure Verification",
  "Resource Map",
  "Do / Don't",
  "중복 folder 역할을 최소화",
  "folder 규칙을 지켰는지 검증",
];

for (const phrase of htmlRequired) {
  if (!html.includes(phrase)) {
    errors.push(`skill.html missing visual section: ${phrase}`);
  }
}

for (const treePhrase of ["apps/web", "features/", "posts/", "apps/api", "modules/", "auth/", "apps/desktop", "src-tauri/", "packages/", "db/"]) {
  if (!html.includes(treePhrase)) {
    errors.push(`skill.html missing folder tree phrase: ${treePhrase}`);
  }
}

for (const apiInfraPhrase of ["logger/", "cache/", "redis/", "packages/db Redis helper", "request logging", "observability/", "health/", "rate limit"]) {
  if (!html.includes(apiInfraPhrase)) {
    errors.push(`skill.html missing API infra phrase: ${apiInfraPhrase}`);
  }
}

const graphQlAutogenPathCount = (html.match(/autogen\.ts/g) ?? []).length;
if (graphQlAutogenPathCount < 3) {
  errors.push("skill.html must show web, api, and desktop GraphQL autogen.ts paths");
}

for (const unifiedPhrase of ["web GraphQL autogen", "API GraphQL autogen", "desktop GraphQL autogen", "codegen.ts", "src/config/env.ts", ".env.stage", "panda.config.ts", "styled-system", "packages/db/drizzle", "test/e2e"]) {
  if (!html.includes(unifiedPhrase)) {
    errors.push(`skill.html missing unified path phrase: ${unifiedPhrase}`);
  }
}

if (backend.includes("src/migrations/")) {
  errors.push("backend-nest.md must not recommend src/migrations when packages/db/drizzle owns migration files");
}

if (!desktop.includes(".env.stage")) {
  errors.push("desktop-tauri.md must include .env.stage");
}

if (/https?:\/\//.test(html)) {
  errors.push("skill.html must not depend on external URLs");
}

if (errors.length) {
  console.error("project-structure validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("project-structure validator passed");
