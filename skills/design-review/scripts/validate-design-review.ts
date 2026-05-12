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
  "references/design-review-criteria.md",
]) {
  if (!exists(file)) failures.push(`Missing required file: ${file}`);
}

const skill = exists("SKILL.md") ? read("SKILL.md") : "";
const reference = exists("references/design-review-criteria.md")
  ? read("references/design-review-criteria.md")
  : "";
const html = exists("skill.html") ? read("skill.html") : "";

for (const term of [
  "general UI review criteria",
  "existing design system",
  "product domain",
  "8px",
  "letter spacing",
  "browser-qa",
  "responsive",
]) {
  if (!skill.toLowerCase().includes(term.toLowerCase())) {
    failures.push(`SKILL.md missing term: ${term}`);
  }
}

for (const term of [
  "Review Model",
  "Product Context Matrix",
  "Default Taste Profile",
  "Token Baseline",
  "Domain Fit",
  "Typography",
  "Controls And States",
  "Accessibility",
  "Responsive Strategy",
  "Evidence Boundaries",
]) {
  if (!reference.includes(term)) failures.push(`design-review-criteria.md missing section: ${term}`);
}

for (const term of ["사용 판단", "리뷰 흐름", "범용 리뷰 체크", "제품 도메인", "디자인 시스템", "파일 관계", "품질 게이트", "금지와 허용"]) {
  if (!html.includes(term)) failures.push(`skill.html missing visible section: ${term}`);
}

for (const [name, content] of [
  ["SKILL.md", skill],
  ["design-review-criteria.md", reference],
  ["skill.html", html],
] as const) {
  if (/\/Users\/|\/home\/|\/private\/tmp|Desktop\/skills/.test(content)) {
    failures.push(`${name} contains a non-portable local path`);
  }
}

if (failures.length) {
  console.error("design-review validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("design-review validation passed");
