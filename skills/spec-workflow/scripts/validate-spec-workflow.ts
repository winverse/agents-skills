#!/usr/bin/env node
import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { validateSkillPackage } from "../../../scripts/validate-skill-package.ts";

const skillRoot = process.argv[2] ?? "skills/spec-workflow";
const repoRoot = path.resolve(skillRoot, "../..");

validateSkillPackage("spec-workflow", skillRoot);

const requiredChecks = [
  ["SKILL.md", "work-claims.md"],
  ["SKILL.md", "overlap block"],
  ["SKILL.md", "shared/hotspot files"],
  ["references/spec-workflow-playbook.md", "work claim preflight 기준"],
  ["references/spec-workflow-playbook.md", "overlap result: clear | blocked"],
  ["agents/openai.yaml", "stop with an overlap block"],
  ["skill.html", "work-claims.md"],
  ["skill.html", "overlap block"],
  ["../../project-snippets/spec-workflow.md", "work-claims.md"],
  ["../../project-snippets/base.md", "overlap block"],
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
  console.error("spec-workflow validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
