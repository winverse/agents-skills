#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const skillRoot = path.resolve(process.argv[2] ?? "skills/agent-eval-harness");
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
requireFile("references/harness-blueprint.md");
requireFile("scripts/validate-agent-eval-harness.ts");
requireFile("agents/openai.yaml");

requireText("SKILL.md", "name: agent-eval-harness", "frontmatter name");
requireText("SKILL.md", "evaluation harness", "harness trigger");
requireText("SKILL.md", "skill selection", "skill routing concern");
requireText("SKILL.md", "guardrails", "guardrail concern");
requireText("SKILL.md", "eval dataset", "dataset setup");
requireText("SKILL.md", "CI gate", "CI gate setup");
requireText("SKILL.md", "Skill invocation", "skill invocation scope");
requireText("SKILL.md", "Workflow behavior", "workflow behavior scope");
requireText("SKILL.md", "Safety boundary", "safety boundary scope");
requireText("SKILL.md", "Output quality", "output quality scope");
requireText("SKILL.md", "evals/agent/cases/*.json", "case folder contract");
requireText("SKILL.md", "scripts/run-agent-evals.ts", "runner script contract");
requireText("SKILL.md", "Do not overfit to one model's wording", "anti-overfit rule");
requireText("SKILL.md", "Harness Lanes", "lane guidance");
requireText("SKILL.md", "Workflow Handoff Seed Cases", "workflow handoff seed cases");
requireText("SKILL.md", "project-structure timing", "project-structure timing seed case");
requireText("SKILL.md", "PRD settings", "PRD settings seed case");
requireText("SKILL.md", "Done Criteria", "done criteria");
requireText("SKILL.md", "success criteria and metrics", "success criteria rule");
requireText("SKILL.md", "typical, edge, and adversarial", "case mix rule");
requireText("SKILL.md", "Cross-agent portability", "cross-agent scope");
requireText("SKILL.md", "minimum safety case pack", "minimum safety pack");
requireText("SKILL.md", "prompt injection or tool misuse", "prompt injection safety");
requireText("SKILL.md", "least privilege", "least privilege safety");
requireText("SKILL.md", "Scrub saved outputs", "artifact hygiene");
requireText("SKILL.md", "Calibrate model-graded", "model grader calibration");
requireText("SKILL.md", "required_link_count", "required link count check");
requireText("SKILL.md", "required_file_reference", "required file reference check");
requireText("SKILL.md", "json_schema", "json schema check");

requireText("references/harness-blueprint.md", "Scope Router", "scope router");
requireText("references/harness-blueprint.md", "Minimal Folder Shape", "folder shape");
requireText("references/harness-blueprint.md", "Case Schema", "case schema");
requireText("references/harness-blueprint.md", "Check Types", "check types");
requireText("references/harness-blueprint.md", "Runner Behavior", "runner behavior");
requireText("references/harness-blueprint.md", "CI Wiring", "CI wiring");
requireText("references/harness-blueprint.md", "Calibration Rules", "calibration rules");
requireText("references/harness-blueprint.md", "Saved-output mode", "saved output mode");
requireText("references/harness-blueprint.md", "Minimum Safety Case Pack", "minimum safety pack");
requireText("references/harness-blueprint.md", "Cross-Agent Portability Pack", "cross-agent portability pack");
requireText("references/harness-blueprint.md", "Workflow-Orchestration Seed Pack", "workflow orchestration seed pack");
requireText("references/harness-blueprint.md", "raw idea discovery does not call it first", "project-structure timing check");
requireText("references/harness-blueprint.md", "Artifact And Trace Hygiene", "artifact hygiene");
requireText("references/harness-blueprint.md", "agentSurfaces", "agent surfaces field");
requireText("references/harness-blueprint.md", "assumptionDate", "assumption date field");
requireText("references/harness-blueprint.md", "exampleType", "example type field");

requireText("skill.html", "사용 판단 매트릭스", "decision matrix");
requireText("skill.html", "하네스 설정 흐름", "workflow diagram");
requireText("skill.html", "검증 강도 차트", "validation chart");
requireText("skill.html", "입출력 스키마", "input output schema");
requireText("skill.html", "필수 케이스 팩", "case pack section");
requireText("skill.html", "결정적 체크 타입", "deterministic check type section");
requireText("skill.html", "required_link_count", "required link count visible guidance");
requireText("skill.html", "required_file_reference", "required file reference visible guidance");
requireText("skill.html", "json_schema", "json schema visible guidance");
requireText("skill.html", "workflow handoff", "workflow handoff visible guidance");
requireText("skill.html", "project-structure timing", "project-structure timing visible guidance");
requireText("skill.html", "파일 관계 지도", "resource map");
requireText("skill.html", "검증 게이트", "validation gates");
requireText("skill.html", "금지와 허용", "misuse guardrails");
requireText("skill.html", "project-snippets/agent-eval-harness.md", "snippet link");
requireText("skill.html", "evals/agent/artifacts", "artifact folder guide");

requireText("agents/openai.yaml", "Agent Eval Harness", "display name");
requireText("agents/openai.yaml", "$agent-eval-harness", "default prompt skill mention");

requireRepoText(
  "project-snippets/agent-eval-harness.md",
  "<skills-root>/skills/agent-eval-harness/SKILL.md",
  "project snippet link",
);
requireRepoText(
  "project-snippets/agent-eval-harness.md",
  "minimum safety pack",
  "project snippet safety pack",
);
requireRepoText(
  "evals/agent/artifacts/README.md",
  "Do not commit raw live traces",
  "artifact hygiene readme",
);
requireRepoText(
  "evals/agent/cases/portability-and-triggers.json",
  "cross_agent_portability",
  "portability eval case",
);
requireRepoText(
  "evals/agent/cases/workflow-orchestration.json",
  "workflow-project-structure-timing",
  "workflow orchestration eval case",
);
requireRepoText(
  "evals/agent/cases/project-setup-verification.json",
  "project-setup-verifies-skill-links",
  "project setup verification eval case",
);
for (const caseId of [
  "workflow-new-project-routing",
  "workflow-dependency-inventory",
  "workflow-prd-settings-gate",
  "workflow-ui-mockup-gate",
  "workflow-cli-no-browser-evidence",
  "workflow-mcp-api-gate-decision",
  "workflow-cross-agent-setup-verification",
  "workflow-completion-ship-local-skill-mapping",
  "workflow-document-sync-artifact-hygiene",
  "workflow-agent-eval-handoff-seeds",
]) {
  requireRepoText("evals/agent/cases/workflow-orchestration.json", caseId, `workflow eval case ${caseId}`);
}
requireRepoText(
  "evals/agent/fixtures/workflow/project-structure-timing.md",
  "Blocked specialist: project-structure",
  "workflow saved output fixture",
);
requireRepoText(
  "scripts/run-agent-evals.ts",
  "workflow cases must check a saved workflow output fixture",
  "workflow saved output enforcement",
);
requireRepoText(
  "README.md",
  "node skills/agent-eval-harness/scripts/validate-agent-eval-harness.ts skills/agent-eval-harness",
  "validator command",
);

if (errors.length) {
  console.error("agent-eval-harness validation failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("agent-eval-harness validation passed");
