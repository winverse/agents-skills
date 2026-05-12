#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const skillRoot = path.resolve(process.argv[2] ?? "skills/show-skills");
const repoRoot = path.resolve(skillRoot, "../..");
const failures: string[] = [];

function read(relativePath: string): string {
  return readFileSync(path.join(skillRoot, relativePath), "utf8");
}

function readRepo(relativePath: string): string {
  return readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function requireFile(relativePath: string): void {
  if (!existsSync(path.join(skillRoot, relativePath))) failures.push(`Missing file: ${relativePath}`);
}

function requireText(file: string, term: string, label: string): void {
  if (!existsSync(path.join(skillRoot, file))) return;
  const text = read(file);
  if (!text.includes(term)) failures.push(`${file} missing ${label}: ${term}`);
}

function requireRepoText(file: string, term: string, label: string): void {
  const fullPath = path.join(repoRoot, file);
  if (!existsSync(fullPath)) {
    failures.push(`Missing repo file: ${file}`);
    return;
  }
  const text = readRepo(file);
  if (!text.includes(term)) failures.push(`${file} missing ${label}: ${term}`);
}

function skillNames(): string[] {
  const skillsRoot = path.join(repoRoot, "skills");
  return readdirSync(skillsRoot)
    .filter((name) => {
      const fullPath = path.join(skillsRoot, name);
      return statSync(fullPath).isDirectory() && existsSync(path.join(fullPath, "SKILL.md"));
    })
    .sort();
}

for (const file of [
  "SKILL.md",
  "skill.html",
  "agents/openai.yaml",
  "scripts/show-skills.ts",
  "scripts/update-html-catalog.ts",
  "scripts/validate-show-skills.ts",
]) {
  requireFile(file);
}

requireText("SKILL.md", "docs/skill-catalog.md", "catalog document reference");
requireText("SKILL.md", "scripts/show-skills.ts", "listing script reference");
requireText("SKILL.md", "scripts/update-html-catalog.ts", "HTML catalog generator reference");
requireText("SKILL.md", "bundled `show-skills` script", "bundled script guidance");
requireText("SKILL.md", "current filesystem", "filesystem source of truth");
requireText("SKILL.md", "--root <path>", "portable root option");
requireText("SKILL.md", "installed layout", "installed layout support");
requireText("scripts/show-skills.ts", 'rawValue === "|"', "block scalar frontmatter parsing");
requireText("scripts/show-skills.ts", "No skills found under explicit root", "explicit invalid root error");
requireText("scripts/show-skills.ts", '"agent-eval-harness": "스킬 운영"', "agent eval harness category");
requireText("scripts/show-skills.ts", "초기 eval harness", "agent eval harness summary");
requireText("scripts/show-skills.ts", "cross-agent portability", "agent eval harness portability summary");
requireText("scripts/show-skills.ts", "artifact hygiene", "agent eval harness artifact hygiene summary");
requireText("scripts/show-skills.ts", '"workflow": "구현과 구조"', "workflow category");
requireText("scripts/show-skills.ts", "infra-aware 구조", "project structure infra-aware summary");
requireText("scripts/show-skills.ts", "doc sync를 앞단에서 조율", "workflow summary");
requireText("scripts/update-html-catalog.ts", "skill-catalog:start", "catalog start marker");
requireText("scripts/update-html-catalog.ts", "Missing skill.html", "missing HTML guard");
requireText("scripts/update-html-catalog.ts", "--check", "catalog check mode");
requireText("skill.html", "사용 판단 매트릭스", "decision matrix");
requireText("skill.html", "목록 생성 흐름", "workflow");
requireText("skill.html", "파일 관계 지도", "resource map");
requireText("skill.html", "skill-catalog:start", "catalog start marker");
requireText("skill.html", "skill-catalog:end", "catalog end marker");
requireText("skill.html", "품질 게이트", "validation gate");
requireText("skill.html", "금지와 허용", "guardrails");
requireText("agents/openai.yaml", "Show Skills", "display name");

if (existsSync(path.join(repoRoot, "docs/skill-catalog.md"))) {
  requireRepoText("docs/skill-catalog.md", "스킬 빠른 선택표", "skill catalog title");
}
requireRepoText(
  "project-snippets/show-skills.md",
  "<skills-root>/skills/show-skills/SKILL.md",
  "project snippet link",
);
requireRepoText(
  "project-snippets/show-skills.md",
  "update-html-catalog.ts",
  "HTML catalog generator snippet guidance",
);
requireRepoText(
  "README.md",
  "node skills/show-skills/scripts/validate-show-skills.ts skills/show-skills",
  "validator command",
);
requireRepoText("README.md", "update-html-catalog.ts", "HTML catalog generator command");

let output = "";
let installedLayoutOutput = "";
try {
  output = execFileSync("node", ["skills/show-skills/scripts/show-skills.ts", "--compact"], {
    cwd: repoRoot,
    encoding: "utf8",
  });
  installedLayoutOutput = execFileSync(
    "node",
    ["skills/show-skills/scripts/show-skills.ts", "--root", "skills", "--compact"],
    {
      cwd: repoRoot,
      encoding: "utf8",
    },
  );
} catch (error) {
  failures.push(`show-skills script failed: ${error instanceof Error ? error.message : String(error)}`);
}

try {
  execFileSync("node", ["skills/show-skills/scripts/update-html-catalog.ts", "skills/show-skills", "--check"], {
    cwd: repoRoot,
    encoding: "utf8",
  });
} catch (error) {
  failures.push(`show-skills HTML catalog is stale: ${error instanceof Error ? error.message : String(error)}`);
}

try {
  execFileSync(
    "node",
    ["skills/show-skills/scripts/show-skills.ts", "--root", "/tmp/definitely-not-a-skills-root", "--compact"],
    {
      cwd: repoRoot,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "pipe"],
    },
  );
  failures.push("show-skills script should fail for an explicit invalid root");
} catch {
  // Expected: explicit bad roots should not look like valid empty catalogs.
}

for (const skillName of skillNames()) {
  if (!output.includes(`\`${skillName}\``)) {
    failures.push(`show-skills output missing skill: ${skillName}`);
  }
  if (!installedLayoutOutput.includes(`\`${skillName}\``)) {
    failures.push(`show-skills installed-layout output missing skill: ${skillName}`);
  }

  const html = existsSync(path.join(skillRoot, "skill.html")) ? read("skill.html") : "";
  const skillHtmlHref = skillName === "show-skills" ? 'href="skill.html"' : `href="../${skillName}/skill.html"`;
  const skillMdHref = skillName === "show-skills" ? 'href="SKILL.md"' : `href="../${skillName}/SKILL.md"`;
  if (!html.includes(`data-skill="${skillName}"`)) {
    failures.push(`show-skills skill.html catalog missing data-skill: ${skillName}`);
  }
  if (!html.includes(skillHtmlHref)) {
    failures.push(`show-skills skill.html catalog missing skill.html link: ${skillName}`);
  }
  if (!html.includes(skillMdHref)) {
    failures.push(`show-skills skill.html catalog missing SKILL.md link: ${skillName}`);
  }
}

for (const [name, content] of [
  ["SKILL.md", existsSync(path.join(skillRoot, "SKILL.md")) ? read("SKILL.md") : ""],
  ["skill.html", existsSync(path.join(skillRoot, "skill.html")) ? read("skill.html") : ""],
  ["show-skills.ts", existsSync(path.join(skillRoot, "scripts/show-skills.ts")) ? read("scripts/show-skills.ts") : ""],
] as const) {
  if (/\/Users\/|\/home\/|\/private\/tmp|Desktop\/skills/.test(content)) {
    failures.push(`${name} contains a non-portable local path`);
  }
}

if (failures.length) {
  console.error("show-skills validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("show-skills validation passed");
