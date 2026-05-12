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
  "scripts/cmux-pin-prompt.mjs",
  "agents/openai.yaml",
]) {
  requireFile(file);
}

requireText("SKILL.md", "name: cmux-automation", "frontmatter name");
requireText("SKILL.md", "scripts/cmux-pin-prompt.mjs", "bundled prompt pin script");
requireText("SKILL.md", "UserPromptSubmit", "Codex prompt hook guidance");
requireText("SKILL.md", "CMUX_WORKSPACE_ID", "cmux environment detection");
requireText("SKILL.md", "cmux rename-tab", "tab title command");
requireText("SKILL.md", "cmux set-status", "status command");
requireText("SKILL.md", "Do not stop at a recipe", "actual setup requirement");
requireText("SKILL.md", "rule-based task label", "rule-based tab label rule");
requireText("SKILL.md", "original full prompt", "full prompt status rule");
requireText("SKILL.md", "Ask before", "safety escalation rule");
requireText("scripts/cmux-pin-prompt.mjs", "CMUX_SURFACE_ID", "surface env targeting");
requireText("scripts/cmux-pin-prompt.mjs", "--surface", "surface-targeted rename");
requireText("scripts/cmux-pin-prompt.mjs", "compactTitle", "compact title helper");
requireText("scripts/cmux-pin-prompt.mjs", "ruleBasedTitle", "rule-based title helper");
requireText("scripts/cmux-pin-prompt.mjs", "CMUX_PIN_PROMPT_TITLE_CHARS", "title length option");
requireText("scripts/cmux-pin-prompt.mjs", "CMUX_PIN_PROMPT_SCOPE", "workspace scope option");
requireText("scripts/cmux-pin-prompt.mjs", "workspaceSurfaceTargets", "workspace target fan-out");
requireText("scripts/cmux-pin-prompt.mjs", "cmux identify", "tab ref fallback discovery");
requireText("scripts/cmux-pin-prompt.mjs", "rename-tab", "rename command");
requireText("scripts/cmux-pin-prompt.mjs", "set-status", "status command");
requireText("scripts/cmux-pin-prompt.mjs", "const title = compactTitle(prompt)", "compact title use");
requireText("scripts/cmux-pin-prompt.mjs", "truncate(prompt, 500)", "long status limit");
requireText("references/hook-recipes.md", "Prompt Pinning Recipe", "prompt pinning recipe");
requireText("references/hook-recipes.md", "CMUX_PIN_PROMPT_SCOPE=workspace", "workspace scope recipe");
requireText("references/hook-recipes.md", "rule-based task label", "rule-based title recipe");
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
