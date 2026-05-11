#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const root = path.resolve(process.argv[2] ?? process.cwd());
const errors: string[] = [];

const ignoredDirs = new Set<string>([
  ".git",
  ".playwright-mcp",
  "archive",
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
  ".toml",
  ".ts",
  ".yaml",
  ".yml",
]);

const privatePathPattern = new RegExp(
  [
    `${"/"}Users${"/"}`,
    `${"/"}home${"/"}`,
    `${"/"}private${"/"}tmp`,
    `Desktop${"/"}skills`,
  ].join("|"),
);
const nodeMajor = Number(process.versions.node.split(".")[0] ?? "0");

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

function topLevelDirs(): string[] {
  return readdirSync(root)
    .filter((name) => {
      const fullPath = path.join(root, name);
      return statSync(fullPath).isDirectory() && !ignoredDirs.has(name);
    })
    .sort();
}

function skillDirs(): string[] {
  return topLevelDirs().filter((name) =>
    existsSync(path.join(root, name, "SKILL.md")),
  );
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
  requireFile(`${skill}/SKILL.md`);
  requireFile(`${skill}/skill.html`);

  if (!history.includes(`\`${skill}\``)) {
    errors.push(`history/skills.md is missing registry entry for ${skill}`);
  }
}

for (const filePath of walkSourceFiles()) {
  const text = readFileSync(filePath, "utf8");
  if (privatePathPattern.test(text)) {
    errors.push(`Non-portable local path found in ${rel(filePath)}`);
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
