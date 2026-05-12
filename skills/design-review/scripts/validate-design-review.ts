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
  "references/interline-design-review.md",
]) {
  if (!exists(file)) failures.push(`Missing required file: ${file}`);
}

const skill = exists("SKILL.md") ? read("SKILL.md") : "";
const reference = exists("references/interline-design-review.md")
  ? read("references/interline-design-review.md")
  : "";
const html = exists("skill.html") ? read("skill.html") : "";

for (const term of [
  "Interline",
  "quiet, operational UI",
  "8px",
  "letter spacing",
  "browser-qa",
  "responsive",
  "Section Study",
  "Chunking Level",
]) {
  if (!skill.toLowerCase().includes(term.toLowerCase())) {
    failures.push(`SKILL.md missing term: ${term}`);
  }
}

for (const term of [
  "Core Taste",
  "Tokens To Prefer",
  "Typography",
  "Controls And States",
  "Interline Product Screens",
  "Interline Implementation Cues",
  "Library",
  "Book Detail",
  "Section Study",
  "Chunking Level",
  "Book Cover",
  "Coolicons",
  "Motion for React",
]) {
  if (!reference.includes(term)) failures.push(`interline-design-review.md missing section: ${term}`);
}

for (const term of ["사용 판단", "리뷰 흐름", "Interline 화면별 체크", "Section Study", "Chunking Level", "파일 관계", "품질 게이트", "금지와 허용"]) {
  if (!html.includes(term)) failures.push(`skill.html missing visible section: ${term}`);
}

for (const [name, content] of [
  ["SKILL.md", skill],
  ["interline-design-review.md", reference],
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
