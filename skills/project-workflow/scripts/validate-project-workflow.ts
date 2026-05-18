#!/usr/bin/env node
import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { validateSkillPackage } from "../../../scripts/validate-skill-package.ts";

const skillRoot = process.argv[2] ?? "skills/project-workflow";
const repoRoot = path.resolve(skillRoot, "../..");

validateSkillPackage("project-workflow", skillRoot);

const requiredChecks = [
  ["SKILL.md", "work-claims.md"],
  ["SKILL.md", "claimed write set"],
  ["SKILL.md", "integration owner"],
  ["references/project-workflow-playbook.md", "parallel multi-session setup 기준"],
  ["references/project-workflow-playbook.md", "one active owner per claimed write path"],
  ["agents/openai.yaml", "parallel work-claims.md lane coordination"],
  ["skill.html", "work-claims.md"],
  ["skill.html", "integration owner"],
  ["../../project-snippets/project-workflow.md", "work-claims.md"],
  ["../../project-snippets/base.md", "work-claims.md"],
] as const;

const failures: string[] = [];
for (const [relativePath, needle] of requiredChecks) {
  const target = relativePath.startsWith("../..")
    ? path.join(repoRoot, relativePath.slice(6))
    : path.join(skillRoot, relativePath);
  const text = readFileSync(target, "utf8");
  if (!text.includes(needle)) {
    failures.push(`${relativePath} must include ${needle}`);
  }
}

if (failures.length) {
  console.error("project-workflow validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
