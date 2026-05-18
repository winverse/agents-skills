#!/usr/bin/env node
import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { validateSkillPackage } from "../../../scripts/validate-skill-package.ts";

const skillRoot = process.argv[2] ?? "skills/course-evaluator";

validateSkillPackage("course-evaluator", skillRoot);

const requiredChecks = [
  ["SKILL.md", "embedded newline"],
  ["SKILL.md", "평가/학생명.md"],
  ["SKILL.md", "합쇼체"],
  ["SKILL.md", "러프하게"],
  ["SKILL.md", "반복 코멘트"],
  ["references/scoring-feedback.md", "구조화 CSV"],
  ["references/scoring-feedback.md", "거의 모범 정답까지"],
  ["references/scoring-feedback.md", "학생별로 새로 쓴다"],
  ["skill.html", "반복 방지"],
] as const;

const failures: string[] = [];
for (const [relativePath, needle] of requiredChecks) {
  const text = readFileSync(path.join(skillRoot, relativePath), "utf8");
  if (!text.includes(needle)) {
    failures.push(`${relativePath} must include ${needle}`);
  }
}

if (failures.length) {
  console.error("course-evaluator validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
