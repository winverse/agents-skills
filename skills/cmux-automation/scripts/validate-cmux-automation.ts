#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
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

function requireDryRunTitle(prompt: string, expectedTitle: string, label: string): void {
  const script = path.join(skillRoot, "scripts/cmux-pin-prompt.mjs");
  try {
    const output = execFileSync(process.execPath, [script], {
      input: JSON.stringify({ prompt }),
      encoding: "utf8",
      env: {
        ...process.env,
        CMUX_PIN_PROMPT_DRY_RUN: "1",
        CMUX_PIN_PROMPT_TITLE_CHARS: "24",
      },
      stdio: ["pipe", "pipe", "pipe"],
      timeout: 2000,
    });
    const parsed = JSON.parse(output);
    if (parsed.title !== expectedTitle) {
      errors.push(`${label}: expected "${expectedTitle}", got "${parsed.title}"`);
    }
  } catch (error) {
    errors.push(`${label}: dry-run title check failed (${String(error)})`);
  }
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
requireText("SKILL.md", "rule-based fallback label", "rule-based tab label rule");
requireText("SKILL.md", "Semantic Title Pattern", "agent semantic title pattern");
requireText("SKILL.md", "Do not call the hook label a semantic summary", "hook is not semantic summary warning");
requireText("SKILL.md", "original full prompt", "full prompt status rule");
requireText("SKILL.md", "Ask before", "safety escalation rule");
requireText("scripts/cmux-pin-prompt.mjs", "CMUX_SURFACE_ID", "surface env targeting");
requireText("scripts/cmux-pin-prompt.mjs", "--surface", "surface-targeted rename");
requireText("scripts/cmux-pin-prompt.mjs", "compactTitle", "compact title helper");
requireText("scripts/cmux-pin-prompt.mjs", "ruleBasedTitle", "rule-based title helper");
requireText("scripts/cmux-pin-prompt.mjs", "CMUX_PIN_PROMPT_TITLE_CHARS", "title length option");
requireText("scripts/cmux-pin-prompt.mjs", "CMUX_PIN_PROMPT_SCOPE", "workspace scope option");
requireText("scripts/cmux-pin-prompt.mjs", "CMUX_PIN_PROMPT_DRY_RUN", "dry-run title test option");
requireText("scripts/cmux-pin-prompt.mjs", "workspaceSurfaceTargets", "workspace target fan-out");
requireText("scripts/cmux-pin-prompt.mjs", "cmux identify", "tab ref fallback discovery");
requireText("scripts/cmux-pin-prompt.mjs", "rename-tab", "rename command");
requireText("scripts/cmux-pin-prompt.mjs", "set-status", "status command");
requireText("scripts/cmux-pin-prompt.mjs", "const title = compactTitle(prompt)", "compact title use");
requireText("scripts/cmux-pin-prompt.mjs", "truncate(prompt, 500)", "long status limit");
requireDryRunTitle(
  "오케이 그리고 이제 필요 스킬 중에 workflow라는 스킬이 필요한데 workflow-skill을 만들어봐",
  "workflow 스킬 생성",
  "workflow skill prompt title",
);
requireDryRunTitle("오늘 수원 날씨 내일도", "수원 날씨", "location weather prompt title");
requireDryRunTitle("오케이 그리고 테스트", "동작 테스트", "leading filler prompt title");
requireText("references/hook-recipes.md", "Prompt Pinning Recipe", "prompt pinning recipe");
requireText("references/hook-recipes.md", "CMUX_PIN_PROMPT_SCOPE=workspace", "workspace scope recipe");
requireText("references/hook-recipes.md", "rule-based fallback label", "rule-based title recipe");
requireText("references/hook-recipes.md", "Agent Semantic Title Recipe", "agent semantic title recipe");
requireText("references/hook-recipes.md", "This hook does not produce a semantic summary", "semantic summary boundary");
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
