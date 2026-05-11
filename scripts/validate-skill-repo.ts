#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const root = path.resolve(process.argv[2] ?? process.cwd());
const errors: string[] = [];

const ignoredDirs = new Set<string>([
  ".git",
  ".githooks",
  ".playwright-mcp",
  "archive",
  "hook-test-skill",
  "images",
  "inspector",
  "node_modules",
]);
const sourceExtensions = new Set<string>([
  ".html",
  ".js",
  ".json",
  ".md",
  ".mjs",
  ".py",
  ".toml",
  ".ts",
  ".yaml",
  ".yml",
]);

const nodeMajor = Number(process.versions.node.split(".")[0] ?? "0");

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

const privatePathPatterns = [
  process.env.HOME ? new RegExp(escapeRegExp(process.env.HOME)) : null,
  /\/private\/tmp\/codex-/,
].filter((pattern): pattern is RegExp => pattern !== null);

function rel(filePath: string): string {
  return path.relative(root, filePath).split(path.sep).join("/");
}

function readText(relativePath: string): string {
  return readFileSync(path.join(root, relativePath), "utf8");
}

function requireFile(relativePath: string): void {
  if (!existsSync(path.join(root, relativePath))) {
    errors.push(`Missing required file: ${relativePath}`);
  }
}

function skillDirs(): string[] {
  const skillsRoot = path.join(root, "skills");
  if (!existsSync(skillsRoot)) return [];

  return readdirSync(skillsRoot)
    .filter((name) => {
      const fullPath = path.join(skillsRoot, name);
      return statSync(fullPath).isDirectory() && existsSync(path.join(fullPath, "SKILL.md"));
    })
    .map((name) => `skills/${name}`)
    .sort();
}

function walkSourceFiles(dir: string = root, output: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = rel(fullPath);
    const top = relativePath.split("/")[0];

    if (entry.isDirectory()) {
      if (!ignoredDirs.has(entry.name) && !ignoredDirs.has(top)) {
        walkSourceFiles(fullPath, output);
      }
      continue;
    }

    if (sourceExtensions.has(path.extname(entry.name))) {
      output.push(fullPath);
    }
  }
  return output;
}

requireFile("README.md");
requireFile("AGENTS.md");
requireFile(".node-version");
requireFile("skills");
requireFile("scripts/validate-skill.ts");
requireFile("docs/skill-lifecycle.md");
requireFile("docs/skill-inspector.md");
requireFile("history/skills.md");
requireFile("project-snippets/base.md");

if (nodeMajor < 22) {
  errors.push(`Node 22+ is required for direct .ts validator execution; current Node is ${process.versions.node}`);
}

const lifecycle = existsSync(path.join(root, "docs/skill-lifecycle.md"))
  ? readText("docs/skill-lifecycle.md")
  : "";
for (const state of ["draft", "active", "critical", "deprecated", "archived"]) {
  if (!lifecycle.includes(`\`${state}\``)) {
    errors.push(`docs/skill-lifecycle.md does not define ${state}`);
  }
}

const history = existsSync(path.join(root, "history/skills.md"))
  ? readText("history/skills.md")
  : "";
for (const skill of skillDirs()) {
  const skillName = path.basename(skill);
  requireFile(`${skill}/SKILL.md`);
  requireFile(`${skill}/skill.html`);
  requireFile(`project-snippets/${skillName}.md`);

  if (!history.includes(`\`${skillName}\``)) {
    errors.push(`history/skills.md is missing registry entry for ${skillName}`);
  }
}

for (const filePath of walkSourceFiles()) {
  const relativePath = rel(filePath);
  const text = readFileSync(filePath, "utf8");
  if (/(^|\/)scripts\/validate-[^/]+\.py$/.test(relativePath)) {
    errors.push(`Repo-owned validator must be TypeScript, not Python: ${relativePath}`);
  }
  if (privatePathPatterns.some((pattern) => pattern.test(text))) {
    errors.push(`Non-portable local path found in ${relativePath}`);
  }
}

if (errors.length) {
  console.error("skill repo validation failed:");
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log("skill repo validation passed");
