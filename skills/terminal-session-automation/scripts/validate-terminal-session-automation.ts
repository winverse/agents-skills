#!/usr/bin/env node
import { readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { validateSkillPackage } from "../../../scripts/validate-skill-package.ts";

const skillRoot = process.argv[2] ?? "skills/terminal-session-automation";

validateSkillPackage("terminal-session-automation", skillRoot);

const requiredChecks = [
  ["SKILL.md", "TERM_PROGRAM=WarpTerminal"],
  ["SKILL.md", "scripts/pin-prompt-title.mjs"],
  ["references/hook-recipes.md", "Warp"],
  ["references/hook-recipes.md", "/dev/tty"],
  ["scripts/pin-prompt-title.mjs", "TERMINAL_SESSION_PROMPT_DRY_RUN"],
  ["scripts/pin-prompt-title.mjs", "TERM_PROGRAM"],
  ["scripts/pin-prompt-title.mjs", "writeFileSync(\"/dev/tty\""],
] as const;

const failures: string[] = [];
for (const [relativePath, needle] of requiredChecks) {
  const text = readFileSync(path.join(skillRoot, relativePath), "utf8");
  if (!text.includes(needle)) {
    failures.push(`${relativePath} must include ${needle}`);
  }
}

if (failures.length) {
  console.error("terminal-session-automation validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}
