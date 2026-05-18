#!/usr/bin/env node
import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { validateSkillPackage } from "../../../scripts/validate-skill-package.ts";

const skillRoot = process.argv[2] ?? "skills/skill-to-html";

validateSkillPackage("skill-to-html", skillRoot);

const requiredChecks = [
  ["SKILL.md", "SVG arrow"],
  ["SKILL.md", "2열 layout"],
  ["SKILL.md", "PC desktop viewport"],
  ["SKILL.md", "mobile/tablet"],
  ["SKILL.md", "arrow endpoint, table width, overflow, text overlap"],
  ["references/visual-guide-standards.md", "render integrity"],
  ["references/visual-guide-standards.md", "marker-end"],
  ["references/visual-guide-standards.md", "PC desktop"],
  ["references/visual-guide-standards.md", "mobile/tablet"],
  ["references/visual-guide-standards.md", "full-width section"],
  ["skill.html", "도표 무결성"],
  ["skill.html", "PC desktop"],
  ["skill.html", "mobile/tablet"],
  ["skill.html", "넓은 표"],
  ["../../project-snippets/skill-to-html.md", "PC desktop"],
  ["../../project-snippets/skill-to-html.md", "mobile/tablet"],
  ["../../scripts/validate-skill-html.ts", "wide scope table should not be nested inside a two-column layout"],
  ["../../scripts/validate-skill-html.ts", "arrow endpoint that does not reach a visible node"],
] as const;

const failures: string[] = [];
for (const [relativePath, needle] of requiredChecks) {
  const target = relativePath.startsWith("../..")
    ? path.resolve(skillRoot, relativePath)
    : path.join(skillRoot, relativePath);
  const text = readFileSync(target, "utf8");
  if (!text.includes(needle)) {
    failures.push(`${relativePath} must include ${needle}`);
  }
}

if (failures.length) {
  console.error("skill-to-html validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
