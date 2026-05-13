#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = path.resolve(process.argv[2] ?? path.join(import.meta.dirname, ".."));
const repoRoot = path.resolve(root, "../..");
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

function requireFile(relativePath: string): void {
  if (!exists(relativePath)) fail(`Missing required file: ${relativePath}`);
}

[
  "SKILL.md",
  "skill.html",
  "agents/openai.yaml",
  "references/grouping-rules.md",
].forEach(requireFile);

const skill = exists("SKILL.md") ? read("SKILL.md") : "";
const html = exists("skill.html") ? read("skill.html") : "";
const rules = exists("references/grouping-rules.md")
  ? read("references/grouping-rules.md")
  : "";
const yaml = exists("agents/openai.yaml") ? read("agents/openai.yaml") : "";

if (!/^---\n[\s\S]+?\n---/.test(skill)) {
  fail("SKILL.md must start with YAML frontmatter");
}
if (!/^name:\s*atomic-committer/m.test(skill)) {
  fail("SKILL.md frontmatter must include name: atomic-committer");
}

for (const term of [
  "logical changeset",
  "forbidden content",
  "live-looking credential assignments",
  "placeholder",
  "hard-block",
  "English conventional prefix",
  "Korean",
  "Push only",
  "git remote",
  ".gitignore",
  "git rm --cached",
]) {
  if (!skill.includes(term)) fail(`SKILL.md missing required term: ${term}`);
}

for (const type of ["feat", "fix", "docs", "chore"]) {
  if (!rules.includes(`\`${type}\``)) {
    fail(`grouping-rules.md missing commit type: ${type}`);
  }
}

for (const term of [
  "Atomic Committer",
  "비밀값 검사",
  "live-looking credential assignments",
  "AWS_ACCESS_KEY=...",
  "OpenAI",
  "DB URL",
  "강제 차단",
  "forbidden-content scan",
  ".gitignore",
  "git check-ignore -v",
  "git rm --cached",
  "작업 단위",
  "영어 prefix + 한글 메시지",
  "remote 있을 때만 push",
  "파일 관계도",
]) {
  if (!html.includes(term)) fail(`skill.html missing visible term: ${term}`);
}

for (const term of [
  "Forbidden Content Triage",
  "git diff --cached -U0 --no-ext-diff",
  "AWS_ACCESS_KEY=...",
  "OPENAI_API_KEY",
  "DATABASE_URL",
  "placeholder",
  "live-looking",
  "cannot be overridden",
  "Gitignore Hygiene",
  "git check-ignore -v <path>",
  "git rm --cached",
]) {
  if (!rules.includes(term)) fail(`grouping-rules.md missing guard term: ${term}`);
}

for (const term of [
  "live-looking credential assignments",
  "AWS_ACCESS_KEY=...",
  "forbidden content",
  ".gitignore",
  "git rm --cached",
]) {
  const snippet = fs.readFileSync(path.join(repoRoot, "project-snippets/atomic-committer.md"), "utf8");
  if (!snippet.includes(term)) fail(`project snippet missing guard term: ${term}`);
}

for (const [name, content] of [
  ["SKILL.md", skill],
  ["skill.html", html],
  ["grouping-rules.md", rules],
  ["agents/openai.yaml", yaml],
]) {
  if (/\/Users\/|\/home\/|\/private\/tmp|Desktop\/skills/.test(content)) {
    fail(`${name} contains a non-portable absolute local path`);
  }
}

const hrefPattern = /href="([^"]+)"/g;
for (const match of html.matchAll(hrefPattern)) {
  const href = match[1];
  if (/^(https?:|mailto:|#|data:)/.test(href)) continue;
  const target = path.resolve(root, href);
  if (target !== repoRoot && !target.startsWith(`${repoRoot}${path.sep}`)) {
    fail(`Suspicious href outside skills tree: ${href}`);
    continue;
  }
  if (!fs.existsSync(target)) fail(`Broken local href in skill.html: ${href}`);
}

if (/<script\b/i.test(html)) fail("skill.html should not include scripts");
if (/https?:\/\/[^"]+/.test(html)) {
  fail("skill.html should not depend on external assets");
}

if (failures.length) {
  console.error("atomic-committer validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("atomic-committer validation passed");
