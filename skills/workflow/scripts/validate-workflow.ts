#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const skillRoot = path.resolve(process.argv[2] ?? "skills/workflow");
const errors: string[] = [];

function read(relativePath: string): string {
  return readFileSync(path.join(skillRoot, relativePath), "utf8");
}

function requireFile(relativePath: string): void {
  if (!existsSync(path.join(skillRoot, relativePath))) {
    errors.push(`Missing file: ${relativePath}`);
  }
}

function requireText(file: string, needle: string, label: string): void {
  if (!existsSync(path.join(skillRoot, file))) return;
  const text = read(file);
  if (!text.includes(needle)) errors.push(`${file} is missing ${label}: ${needle}`);
}

for (const file of [
  "SKILL.md",
  "skill.html",
  "agents/openai.yaml",
  "references/project-workflow-playbook.md",
  "references/upstream-dependency-map.md",
]) {
  requireFile(file);
}

requireText("SKILL.md", "name: workflow", "frontmatter name");
requireText("SKILL.md", "Dependency Contract", "dependency contract");
requireText("SKILL.md", "orchestration skill", "orchestration skill wording");
requireText("SKILL.md", "upstream-dependency-map.md", "upstream dependency map reference");
requireText("SKILL.md", "Matt Pocock-style skills", "Matt Pocock dependency family");
requireText("SKILL.md", "GStack-style skills", "GStack dependency family");
requireText("SKILL.md", "Superpowers-style skills", "Superpowers dependency family");
requireText("SKILL.md", "Do not claim a dependent skill was used", "dependent skill honesty rule");
requireText("SKILL.md", "orchestration boundary", "source update boundary rule");
requireText("SKILL.md", "domain language", "domain-first rule");
requireText("SKILL.md", "ADRs", "architecture decision rule");
requireText("SKILL.md", "Do not call `project-structure` during raw idea discovery", "project-structure timing rule");
requireText("SKILL.md", "project-structure for folder/env/codegen/db/infra boundaries", "project-structure flow handoff");
requireText("SKILL.md", "agent-eval-harness seed cases", "agent eval handoff");
requireText("SKILL.md", "vertical slices", "vertical slice rule");
requireText("SKILL.md", "RED -> GREEN -> REFACTOR", "TDD loop");
requireText("SKILL.md", ".scratch/<feature-slug>/", "scratch artifact path");
requireText("SKILL.md", "active adapter surface", "cross-agent adapter rule");
requireText("SKILL.md", "Runtime adapter", "runtime adapter output field");
requireText("SKILL.md", "Dependencies:", "dependencies output field");
requireText("SKILL.md", "setup-matt-pocock-skills", "original setup skill name");
requireText("SKILL.md", "grill-me", "original domain interview skill name");
requireText("SKILL.md", "grill-with-docs", "original docs-based interview skill name");
requireText("SKILL.md", "office-hours", "GStack-style product challenge");
requireText("SKILL.md", "visual mockup selection", "mockup selection rule");
requireText("SKILL.md", "to-prd", "original PRD skill name");
requireText("SKILL.md", "PRD Settings", "PRD settings section");
requireText("SKILL.md", ".scratch/<feature-slug>/PRD.md", "PRD output path");
requireText("SKILL.md", "first usable slice", "PRD first usable slice rule");
requireText("SKILL.md", "included scope", "PRD included scope rule");
requireText("SKILL.md", "excluded scope", "PRD excluded scope rule");
requireText("SKILL.md", "to-issues", "original issue split skill name");
requireText("SKILL.md", "subagent-driven-development", "original subagent skill name");
requireText("SKILL.md", "project-workflow-playbook.md", "reference link");
requireText("references/project-workflow-playbook.md", "Technology Decision Pass", "technology decision pass");
requireText("references/project-workflow-playbook.md", "Project Structure Handoff", "project-structure handoff");
requireText("references/project-workflow-playbook.md", "Do not use `project-structure` during raw idea discovery", "raw idea project-structure guard");
requireText("references/project-workflow-playbook.md", "Agent Eval Handoff", "agent eval handoff reference");
requireText("references/project-workflow-playbook.md", "Project-structure timing", "project-structure timing eval case");
requireText("references/project-workflow-playbook.md", "Dependency Inventory", "reference dependency inventory");
requireText("references/project-workflow-playbook.md", "Canonical Direct-Use Order", "canonical direct-use order");
requireText("references/project-workflow-playbook.md", "PRD Settings", "reference PRD settings");
requireText("references/project-workflow-playbook.md", "Data source of truth", "reference PRD data source rule");
requireText("references/project-workflow-playbook.md", "Cross-Agent Portability Pass", "cross-agent portability pass");
requireText("references/project-workflow-playbook.md", "External Skill Family Mapping", "external skill family mapping");
requireText("references/project-workflow-playbook.md", "Product Challenge Questions", "product challenge questions");
requireText("references/project-workflow-playbook.md", "Visual Mockup Selection Pass", "visual mockup selection pass");
requireText("references/project-workflow-playbook.md", "grill-me", "reference original grill-me skill name");
requireText("references/project-workflow-playbook.md", "Vertical Slice Rule", "vertical slice rule reference");
requireText("references/project-workflow-playbook.md", "TDD Role Separation", "subagent TDD role separation");
requireText("references/project-workflow-playbook.md", "Workflow Log", "workflow log guidance");
requireText("references/upstream-dependency-map.md", "Workflow Upstream Dependency Map", "upstream map title");
requireText("references/upstream-dependency-map.md", "Update-Following Rule", "source update following rule");
requireText("references/upstream-dependency-map.md", "Duplicate Boundary Guardrails", "duplicate boundary guardrails");
requireText("references/upstream-dependency-map.md", "Direction Over Speed", "direction over speed rule");
requireText("references/upstream-dependency-map.md", "Mockup Direction Gate", "mockup direction gate");
requireText("references/upstream-dependency-map.md", "mattpocock/skills", "Matt Pocock source origin");
requireText("references/upstream-dependency-map.md", "garrytan/gstack", "GStack source origin");
requireText("references/upstream-dependency-map.md", "source skill folder named `office-hours`", "portable source skill cue");
requireText("skill.html", "사용 판단 매트릭스", "decision matrix");
requireText("skill.html", "기본 흐름", "workflow diagram");
requireText("skill.html", "파일 관계 지도", "resource map");
requireText("skill.html", "품질 게이트", "validation gates");
requireText("skill.html", "금지와 허용", "guardrails");
requireText("skill.html", "의존 스킬 확인", "dependency inventory visible guidance");
requireText("skill.html", "Matt Pocock", "Matt Pocock visible dependency");
requireText("skill.html", "GStack", "GStack visible dependency");
requireText("skill.html", "Superpowers", "Superpowers visible dependency");
requireText("skill.html", "업스트림 추적", "upstream tracking visible guidance");
requireText("skill.html", "방향 우선", "direction over speed visible guidance");
requireText("skill.html", "adapter", "cross-agent adapter guidance");
requireText("skill.html", "grill-me", "grill-me visible guidance");
requireText("skill.html", "grill-with-docs", "grill-with-docs visible guidance");
requireText("skill.html", "office-hours", "office-hours visible guidance");
requireText("skill.html", "project-structure", "project-structure visible guidance");
requireText("skill.html", "구조 handoff", "project-structure handoff visible guidance");
requireText("skill.html", "eval seed", "agent eval seed visible guidance");
requireText("skill.html", "PRD 설정", "PRD settings visible guidance");
requireText("skill.html", ".scratch/&lt;feature-slug&gt;/PRD.md", "PRD path visible guidance");
requireText("skill.html", "mockup 선택", "mockup selection visible guidance");
requireText("agents/openai.yaml", "$workflow", "default prompt skill mention");

if (errors.length) {
  console.error("workflow validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("workflow validation passed");
