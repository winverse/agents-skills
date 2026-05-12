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
  "references/review-checklist.md",
  "references/js-ts-style.md",
]) {
  if (!exists(file)) failures.push(`Missing required file: ${file}`);
}

const skill = exists("SKILL.md") ? read("SKILL.md") : "";
const jsTs = exists("references/js-ts-style.md") ? read("references/js-ts-style.md") : "";
const html = exists("skill.html") ? read("skill.html") : "";

for (const term of ["Findings lead", "SRP", "SOLID", "map", "filter", "reduce", "Iterable", "missing tests", "MCP or tool-call boundaries"]) {
  if (!skill.includes(term)) failures.push(`SKILL.md missing term: ${term}`);
}

for (const term of ["Functional Collection Style", "When Loops Are Better", "TypeScript Bar"]) {
  if (!jsTs.includes(term)) failures.push(`js-ts-style.md missing section: ${term}`);
}

for (const term of ["사용 판단", "리뷰 흐름", "파일 관계", "품질 게이트", "금지와 허용"]) {
  if (!html.includes(term)) failures.push(`skill.html missing visible section: ${term}`);
}

for (const [name, content] of [
  ["SKILL.md", skill],
  ["js-ts-style.md", jsTs],
  ["skill.html", html],
] as const) {
  if (/\/Users\/|\/home\/|\/private\/tmp|Desktop\/skills/.test(content)) {
    failures.push(`${name} contains a non-portable local path`);
  }
}

if (failures.length) {
  console.error("code-review validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("code-review validation passed");
