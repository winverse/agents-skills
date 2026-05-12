#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const skillRoot = path.resolve(process.argv[2] ?? "skills/sync-docs");
const repoRoot = path.resolve(skillRoot, "../..");
const errors: string[] = [];

function read(relativePath: string): string {
  return readFileSync(path.join(skillRoot, relativePath), "utf8");
}

function requireFile(relativePath: string): void {
  if (!existsSync(path.join(skillRoot, relativePath))) {
    errors.push(`Missing file: ${relativePath}`);
  }
}

function requireText(file: string, needle: string, label: string): void {
  if (!existsSync(path.join(skillRoot, file))) return;
  const text = read(file);
  if (!text.includes(needle)) errors.push(`${file} is missing ${label}: ${needle}`);
}

function requireRepoText(file: string, needle: string, label: string): void {
  const fullPath = path.join(repoRoot, file);
  if (!existsSync(fullPath)) {
    errors.push(`Missing repo file: ${file}`);
    return;
  }
  const text = readFileSync(fullPath, "utf8");
  if (!text.includes(needle)) errors.push(`${file} is missing ${label}: ${needle}`);
}

requireFile("SKILL.md");
requireFile("skill.html");
requireFile("references/doc-audit-checklist.md");
requireFile("agents/openai.yaml");

requireText("SKILL.md", "name: sync-docs", "frontmatter name");
requireText("SKILL.md", "source of truth", "source-of-truth guidance");
requireText("SKILL.md", "Ask the user", "ambiguity escalation rule");
requireText("SKILL.md", "documentation inventory", "inventory workflow");
requireText("SKILL.md", "claim", "claim ledger concept");
requireText("references/doc-audit-checklist.md", "Claim Ledger", "claim ledger checklist");
requireText("references/doc-audit-checklist.md", "Common Conflict Types", "conflict taxonomy");
requireText("skill.html", "사용 판단 매트릭스", "decision matrix");
requireText("skill.html", "실행 흐름", "workflow diagram");
requireText("skill.html", "파일 관계 지도", "resource map");
requireText("skill.html", "project-snippets/sync-docs.md", "snippet link");
requireText("agents/openai.yaml", "Sync Docs", "display name");

requireRepoText(
  "project-snippets/sync-docs.md",
  "<skills-root>/skills/sync-docs/SKILL.md",
  "project snippet link",
);

if (errors.length) {
  console.error("sync-docs validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("sync-docs validation passed");
