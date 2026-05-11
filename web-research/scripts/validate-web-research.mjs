#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const root = path.resolve(process.argv[2] || path.join(import.meta.dirname, ".."));
const read = (rel) => fs.readFileSync(path.join(root, rel), "utf8");
const exists = (rel) => fs.existsSync(path.join(root, rel));
const failures = [];

function fail(message) {
  failures.push(message);
}

function requireFile(rel) {
  if (!exists(rel)) fail(`Missing required file: ${rel}`);
}

[
  "SKILL.md",
  "skill.html",
  "agents/openai.yaml",
  "references/preferences.md",
  "references/structured-search.md",
  "references/eval-prompts.md",
].forEach(requireFile);

const skill = exists("SKILL.md") ? read("SKILL.md") : "";
const html = exists("skill.html") ? read("skill.html") : "";
const structured = exists("references/structured-search.md") ? read("references/structured-search.md") : "";
const evals = exists("references/eval-prompts.md") ? read("references/eval-prompts.md") : "";
const yaml = exists("agents/openai.yaml") ? read("agents/openai.yaml") : "";

if (!/^---\n[\s\S]+?\n---/.test(skill)) fail("SKILL.md must start with YAML frontmatter");
if (!/^name:\s*web-research/m.test(skill)) fail("SKILL.md frontmatter must include name: web-research");
if (!/^description:\s*["'].+["']/m.test(skill)) fail("SKILL.md description should be quoted");

const requiredSkillTerms = [
  "research budget",
  "query fan-out",
  "citation ledger",
  "evidence scoring",
  "extraction",
  "counterexample",
  "stop",
  "untrusted content",
];

for (const term of requiredSkillTerms) {
  if (!skill.toLowerCase().includes(term)) fail(`SKILL.md missing required term: ${term}`);
}

const requiredStructuredHeadings = [
  "## Research Budget Router",
  "## Query Fan-Out",
  "## Stop Rules",
  "## Extraction Layer",
  "## Source Ledger",
  "## Evidence Score",
  "## Tool Knobs",
  "## Safety Rules",
];

for (const heading of requiredStructuredHeadings) {
  if (!structured.includes(heading)) fail(`structured-search.md missing heading: ${heading}`);
}

const requiredHtmlTerms = [
  "Agentic research loop",
  "query fan-out",
  "source ledger",
  "safety boundary",
  "fan-out / ledger",
];

for (const term of requiredHtmlTerms) {
  if (!html.includes(term)) fail(`skill.html missing visible term: ${term}`);
}

const removedDomainTerms = [
  ["bio", "medical"].join(""),
  ["bio", "only"].join("-"),
  ["Pub", "Med"].join(""),
  ["Me", "SH"].join(""),
  ["PI", "CO"].join(""),
];
const forbidden = new RegExp(`\\b(${removedDomainTerms.join("|")})\\b`, "i");
for (const [name, content] of [
  ["SKILL.md", skill],
  ["structured-search.md", structured],
  ["skill.html", html],
  ["eval-prompts.md", evals],
]) {
  if (forbidden.test(content)) fail(`${name} contains removed domain-specific wording`);
}

if (!yaml.includes("query fan-out") || !yaml.includes("evidence scoring")) {
  fail("agents/openai.yaml should mention query fan-out and evidence scoring");
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

const curvedPathPattern = /<path\b(?=[^>]*\bd="M(?!0,0)[^"]*")[^>]*>/g;
for (const match of html.matchAll(curvedPathPattern)) {
  if (!/\bfill="none"/.test(match[0])) {
    fail(`Curved SVG path missing fill="none": ${match[0].slice(0, 120)}`);
  }
}

if (/<script\b/i.test(html)) fail("skill.html should not include scripts");
if (/https?:\/\/[^"]+/.test(html)) fail("skill.html should not depend on external assets");

const evalPromptCount = (evals.match(/^###\s+/gm) || []).length;
if (evalPromptCount < 8) fail("eval-prompts.md should contain at least 8 eval prompts");

if (failures.length) {
  console.error("web-research validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("web-research validation passed");
