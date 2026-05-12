#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const skillRoot = path.resolve(process.argv[2] ?? "skills/karpathy-thinkings");
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
requireFile("references/source-notes.md");
requireFile("agents/openai.yaml");

for (const phrase of [
  "name: karpathy-thinkings",
  "Think Before Coding",
  "Simplicity First",
  "Surgical Changes",
  "Goal-Driven Execution",
  "unofficial local adaptation",
  "success criteria",
]) {
  requireSkillText("SKILL.md", phrase, `core phrase ${phrase}`);
}

for (const phrase of [
  "Public Sources",
  "Local Adaptation Rules",
  "Do not copy long passages verbatim",
]) {
  requireSkillText("references/source-notes.md", phrase, `source note ${phrase}`);
}

for (const phrase of [
  "사용 판단 매트릭스",
  "네 가지 원칙",
  "실행 흐름",
  "위험도 막대",
  "파일 관계 지도",
  "project-snippets/karpathy-thinkings.md",
]) {
  requireSkillText("skill.html", phrase, `HTML section ${phrase}`);
}

requireSkillText("agents/openai.yaml", "Karpathy Thinkings", "display name");
requireRepoText(
  "project-snippets/karpathy-thinkings.md",
  "<skills-root>/skills/karpathy-thinkings/SKILL.md",
  "project snippet link",
);

if (errors.length) {
  console.error("karpathy-thinkings validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("karpathy-thinkings validation passed");
