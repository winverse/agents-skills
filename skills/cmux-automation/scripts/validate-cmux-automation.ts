#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const skillRoot = path.resolve(process.argv[2] ?? "skills/cmux-automation");
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

for (const file of [
  "SKILL.md",
  "skill.html",
  "references/hook-recipes.md",
  "agents/openai.yaml",
]) {
  requireFile(file);
}

requireText("SKILL.md", "name: cmux-automation", "frontmatter name");
requireText("SKILL.md", "UserPromptSubmit", "Codex prompt hook guidance");
requireText("SKILL.md", "CMUX_WORKSPACE_ID", "cmux environment detection");
requireText("SKILL.md", "cmux rename-tab", "tab title command");
requireText("SKILL.md", "cmux set-status", "status command");
requireText("SKILL.md", "Ask before", "safety escalation rule");
requireText("references/hook-recipes.md", "Prompt Pinning Recipe", "prompt pinning recipe");
requireText("references/hook-recipes.md", "Payload Discovery", "payload discovery guidance");
requireText("references/hook-recipes.md", "Safety Rules", "safety rules");
requireText("skill.html", "사용 판단 매트릭스", "decision matrix");
requireText("skill.html", "자동화 흐름", "workflow diagram");
requireText("skill.html", "파일 관계 지도", "resource map");
requireText("skill.html", "품질 게이트", "validation gate");
requireText("skill.html", "project-snippets/cmux-automation.md", "snippet link");
requireText("agents/openai.yaml", "Cmux Automation", "display name");

requireRepoText(
  "project-snippets/cmux-automation.md",
  "<skills-root>/skills/cmux-automation/SKILL.md",
  "project snippet link",
);

if (errors.length) {
  console.error("cmux-automation validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("cmux-automation validation passed");
