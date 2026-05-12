#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const skillRoot = path.resolve(process.argv[2] ?? "skills/skill-update");
const repoRoot = path.resolve(skillRoot, "../..");
const errors: string[] = [];

function readSkill(relativePath: string): string {
  return readFileSync(path.join(skillRoot, relativePath), "utf8");
}

function requireFile(relativePath: string): void {
  if (!existsSync(path.join(skillRoot, relativePath))) {
    errors.push(`Missing file: ${relativePath}`);
  }
}

function requireSkillText(file: string, needle: string, label: string): void {
  if (!existsSync(path.join(skillRoot, file))) return;
  const text = readSkill(file);
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

requireFile("SKILL.md");
requireFile("skill.html");
requireFile("references/update-checklist.md");
requireFile("agents/openai.yaml");

requireSkillText("SKILL.md", "name: skill-update", "frontmatter name");
requireSkillText("SKILL.md", "skill-to-html", "skill-to-html coordination");
requireSkillText("SKILL.md", "sync-docs", "sync-docs coordination");
requireSkillText("SKILL.md", "history/skills.md", "history update rule");
requireSkillText("SKILL.md", "Ask", "ambiguity escalation");
requireSkillText("references/update-checklist.md", "Package Completeness Matrix", "package matrix");
requireSkillText("references/update-checklist.md", "Coordination Rules", "coordination rules");
requireSkillText("references/update-checklist.md", "History Rules", "history rules");
requireSkillText("skill.html", "사용 판단 매트릭스", "decision matrix");
requireSkillText("skill.html", "실행 흐름", "workflow");
requireSkillText("skill.html", "변경 패키지 범위", "coverage chart");
requireSkillText("skill.html", "파일 관계 지도", "resource map");
requireSkillText("skill.html", "project-snippets/skill-update.md", "snippet link");
requireSkillText("agents/openai.yaml", "Skill Update", "display name");

requireRepoText(
  "project-snippets/skill-update.md",
  "<skills-root>/skills/skill-update/SKILL.md",
  "project snippet link",
);

if (errors.length) {
  console.error("skill-update validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("skill-update validation passed");
