#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { validateSkillPackage } from "../../../scripts/validate-skill-package.ts";

const skillRoot = process.argv[2] ?? "skills/warp-automation";

validateSkillPackage("warp-automation", skillRoot);

const requiredChecks = [
  ["SKILL.md", "답변 첫 줄"],
  ["SKILL.md", "현재 사용자 프롬프트"],
  ["SKILL.md", "32자 이내"],
  ["SKILL.md", "둘째 줄은 비운다"],
  ["SKILL.md", "terminal session"],
  ["SKILL.md", "기본 경로가 아니다"],
  ["references/response-title-format.md", "응답 첫 줄 title 형식"],
  ["references/response-title-format.md", "host 확인"],
  ["references/response-title-format.md", "terminal session 탐색"],
  ["../../project-snippets/warp-automation.md", "first line"],
  ["../../project-snippets/warp-automation.md", "32 characters or fewer"],
  ["agents/openai.yaml", "first line"],
  ["agents/openai.yaml", "32 characters or fewer"],
] as const;

const forbiddenFiles = [
  "scripts/pin-warp-title.mjs",
  "scripts/apply-warp-session.mjs",
  "references/hook-recipes.md",
] as const;

const forbiddenNeedles = [
  ["SKILL.md", "WARP_SESSION_TARGET_TTY"],
  ["SKILL.md", "matched:true"],
  ["SKILL.md", "verified:true"],
  ["SKILL.md", "/hooks 승인"],
  ["../../project-snippets/warp-automation.md", "WARP_SESSION_TARGET_TTY"],
  ["../../project-snippets/warp-automation.md", "target-TTY"],
  ["../../project-snippets/warp-automation.md", "readback"],
  ["agents/openai.yaml", "target-TTY"],
] as const;

const failures: string[] = [];
for (const [relativePath, needle] of requiredChecks) {
  const text = readFileSync(path.join(skillRoot, relativePath), "utf8");
  if (!text.includes(needle)) {
    failures.push(`${relativePath} must include ${needle}`);
  }
}

for (const relativePath of forbiddenFiles) {
  if (existsSync(path.join(skillRoot, relativePath))) {
    failures.push(`${relativePath} should not exist in simplified warp-automation`);
  }
}

for (const [relativePath, needle] of forbiddenNeedles) {
  const text = readFileSync(path.join(skillRoot, relativePath), "utf8");
  if (text.includes(needle)) {
    failures.push(`${relativePath} must not include ${needle}`);
  }
}

if (failures.length) {
  console.error("warp-automation validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
