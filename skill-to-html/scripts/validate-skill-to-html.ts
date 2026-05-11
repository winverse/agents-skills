#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

type NamedContent = [name: string, content: string];

const root = path.resolve(process.argv[2] ?? path.join(import.meta.dirname, ".."));
const failures: string[] = [];

function read(relativePath: string): string {
  return fs.readFileSync(path.join(root, relativePath), "utf8");
}

function exists(relativePath: string): boolean {
  return fs.existsSync(path.join(root, relativePath));
}

function fail(message: string): void {
  failures.push(message);
}

for (const file of [
  "SKILL.md",
  "skill.html",
  "agents/openai.yaml",
  "references/visual-guide-standards.md",
]) {
  if (!exists(file)) fail(`Missing required file: ${file}`);
}

const skill = exists("SKILL.md") ? read("SKILL.md") : "";
const html = exists("skill.html") ? read("skill.html") : "";
const standards = exists("references/visual-guide-standards.md")
  ? read("references/visual-guide-standards.md")
  : "";

if (!/^---\n[\s\S]+?\n---/.test(skill)) {
  fail("SKILL.md must start with YAML frontmatter");
}
if (!/^name:\s*skill-to-html/m.test(skill)) {
  fail("SKILL.md frontmatter must include name: skill-to-html");
}

for (const term of ["Use now", "Revise", "Skip", "Ask / combine"]) {
  if (!html.includes(term)) fail(`skill.html decision matrix missing: ${term}`);
}

for (const term of [
  "SKILL.md",
  "visual-guide-standards.md",
  "project-snippets/skill-to-html.md",
]) {
  if (!html.includes(term)) fail(`skill.html missing file link text: ${term}`);
}

if (!html.includes(">S2H<")) fail("skill.html mark should be S2H");
if (/<script\b/i.test(html)) fail("skill.html should not include scripts");
if (/https?:\/\/[^"]+/.test(html)) {
  fail("skill.html should not depend on external assets");
}

const filesToCheck: NamedContent[] = [
  ["SKILL.md", skill],
  ["skill.html", html],
  ["visual-guide-standards.md", standards],
];

for (const [name, content] of filesToCheck) {
  if (/\/Users\/|\/home\/|\/private\/tmp|Desktop\/skills/.test(content)) {
    fail(`${name} contains a non-portable absolute local path`);
  }
}

const hrefPattern = /href="([^"]+)"/g;
for (const match of html.matchAll(hrefPattern)) {
  const href = match[1];
  if (/^(https?:|mailto:|#|data:)/.test(href)) continue;
  const target = path.resolve(root, href);
  if (!target.startsWith(path.resolve(root, ".."))) {
    fail(`Suspicious href outside skills tree: ${href}`);
    continue;
  }
  if (!fs.existsSync(target)) fail(`Broken local href in skill.html: ${href}`);
}

const visualSignals = [
  "사용 판단 매트릭스",
  "skill.html 생성 흐름",
  "필수 시각 요소 비중",
  "파일 관계 지도",
  "금지와 허용",
];

for (const signal of visualSignals) {
  if (!html.includes(signal)) fail(`skill.html missing visual section: ${signal}`);
}

if (failures.length) {
  console.error("skill-to-html validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("skill-to-html validation passed");
