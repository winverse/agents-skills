#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const skillRoot = path.resolve(process.argv[2] ?? "skills/agent-improvement-loop");
const repoRoot = path.resolve(skillRoot, "../..");
const errors: string[] = [];

function readSkill(relativePath: string): string {
  return readFileSync(path.join(skillRoot, relativePath), "utf8");
}

function readRepo(relativePath: string): string {
  return readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function requireFile(relativePath: string): void {
  if (!existsSync(path.join(skillRoot, relativePath))) {
    errors.push(`Missing file: ${relativePath}`);
  }
}

function requireText(file: string, needle: string, label: string): void {
  const fullPath = path.join(skillRoot, file);
  if (!existsSync(fullPath)) return;
  const text = readSkill(file);
  if (!text.includes(needle)) errors.push(`${file} is missing ${label}: ${needle}`);
}

function requireRepoText(file: string, needle: string, label: string): void {
  const fullPath = path.join(repoRoot, file);
  if (!existsSync(fullPath)) {
    errors.push(`Missing repo file: ${file}`);
    return;
  }
  const text = readRepo(file);
  if (!text.includes(needle)) errors.push(`${file} is missing ${label}: ${needle}`);
}

requireFile("SKILL.md");
requireFile("skill.html");
requireFile("references/loop-checklist.md");
requireFile("scripts/validate-agent-improvement-loop.ts");
requireFile("agents/openai.yaml");

requireText("SKILL.md", "name: agent-improvement-loop", "frontmatter name");
requireText("SKILL.md", "spare token", "spare token trigger");
requireText("SKILL.md", "Skills repo track", "skills repo track");
requireText("SKILL.md", "General repo track", "general repo track");
requireText("SKILL.md", "Invocation", "invocation lane");
requireText("SKILL.md", "Validation", "validation lane");
requireText("SKILL.md", "Alignment", "alignment lane");
requireText("SKILL.md", "Quality", "quality lane");
requireText("SKILL.md", "consent gate", "spend-down consent gate");
requireText("SKILL.md", "남은 토큰을 최대한 사용해서 안전한 backlog를 처리할까요? (예/아니오)", "yes/no consent question");
requireText("SKILL.md", "Spend-down consent", "spend-down consent output");
requireText("SKILL.md", "Ceiling mode", "ceiling mode");
requireText("SKILL.md", "staged multi-agent review", "staged multi-agent review");

requireText("references/loop-checklist.md", "One Skill Or Two?", "one-vs-two decision");
requireText("references/loop-checklist.md", "Budget Router", "budget router");
requireText("references/loop-checklist.md", "Spend-Down Consent Gate", "spend-down consent gate");
requireText("references/loop-checklist.md", "남은 토큰을 최대한 사용해서 안전한 backlog를 처리할까요? (예/아니오)", "yes/no consent question");
requireText("references/loop-checklist.md", "Staged Multi-Agent Review", "staged multi-agent review");
requireText("references/loop-checklist.md", "Skills Repo Track", "skills repo checklist");
requireText("references/loop-checklist.md", "General Repo Track", "general repo checklist");
requireText("references/loop-checklist.md", "Done Criteria", "done criteria");

requireText("skill.html", "사용 판단 매트릭스", "decision matrix");
requireText("skill.html", "루프 실행 흐름", "workflow diagram");
requireText("skill.html", "예/아니오 판단", "yes/no gate");
requireText("skill.html", "남은 토큰을 최대한 사용할까요?", "visible consent question");
requireText("skill.html", "입출력 스키마", "input output schema");
requireText("skill.html", "파일 관계 지도", "resource map");
requireText("skill.html", "검증 게이트", "validation gates");
requireText("skill.html", "금지와 허용", "misuse guardrails");
requireText("skill.html", "project-snippets/agent-improvement-loop.md", "snippet link");

requireText("agents/openai.yaml", "Agent Improvement Loop", "display name");

requireRepoText(
  "project-snippets/agent-improvement-loop.md",
  "<skills-root>/skills/agent-improvement-loop/SKILL.md",
  "project snippet link",
);
requireRepoText(
  "README.md",
  "node skills/agent-improvement-loop/scripts/validate-agent-improvement-loop.ts skills/agent-improvement-loop",
  "validator command",
);

if (errors.length) {
  console.error("agent-improvement-loop validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("agent-improvement-loop validation passed");
