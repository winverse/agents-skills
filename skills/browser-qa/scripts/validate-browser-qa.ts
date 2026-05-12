#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = path.resolve(process.argv[2] ?? path.join(import.meta.dirname, ".."));
const failures: string[] = [];

function read(relativePath: string): string {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function exists(relativePath: string): boolean {
  return fs.existsSync(path.join(root, relativePath));
}

for (const file of [
  "SKILL.md",
  "skill.html",
  "agents/openai.yaml",
  "references/browser-checklist.md",
]) {
  if (!exists(file)) failures.push(`Missing required file: ${file}`);
}

const skill = exists("SKILL.md") ? read("SKILL.md") : "";
const html = exists("skill.html") ? read("skill.html") : "";
const checklist = exists("references/browser-checklist.md") ? read("references/browser-checklist.md") : "";
const yaml = exists("agents/openai.yaml") ? read("agents/openai.yaml") : "";

for (const term of [
  "console",
  "network",
  "accessibility snapshot",
  "screenshot",
  "text overflow",
  "intended visible content",
  "200 OK",
  "viewport",
  "Playwright",
]) {
  if (!skill.toLowerCase().includes(term.toLowerCase())) {
    failures.push(`SKILL.md missing term: ${term}`);
  }
}

for (const term of ["Default Viewports", "Failure Severity", "Static HTML", "Frontend App", "Intent Match", "200 OK"]) {
  if (!checklist.includes(term)) failures.push(`browser-checklist.md missing section: ${term}`);
}

for (const term of ["사용 판단", "검증 흐름", "의도 검증", "200 OK", "파일 관계", "품질 게이트", "금지와 허용"]) {
  if (!html.includes(term)) failures.push(`skill.html missing visible section: ${term}`);
}

if (!yaml.includes("Browser QA") || !yaml.includes("Playwright")) {
  failures.push("agents/openai.yaml should describe Browser QA and Playwright");
}

for (const [name, content] of [
  ["SKILL.md", skill],
  ["skill.html", html],
  ["browser-checklist.md", checklist],
  ["agents/openai.yaml", yaml],
] as const) {
  if (/\/Users\/|\/home\/|\/private\/tmp|Desktop\/skills/.test(content)) {
    failures.push(`${name} contains a non-portable local path`);
  }
}

if (failures.length) {
  console.error("browser-qa validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("browser-qa validation passed");
