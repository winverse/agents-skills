#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const root = path.resolve(process.argv[2] ?? process.cwd());
const skillsRoot = path.join(root, "skills");
const failures: string[] = [];

const allowedEnglishOnlyHeadings = new Set([
  "ADRs",
  "API",
  "CI",
  "MCP",
  "MVP",
  "PRD",
  "README",
  "RED -> GREEN -> REFACTOR",
  "SKILL.md",
  "TDD",
  "URL",
]);

function rel(filePath: string): string {
  return path.relative(root, filePath).split(path.sep).join("/");
}

function walkMarkdown(dir: string, output: string[] = []): string[] {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkMarkdown(fullPath, output);
      continue;
    }
    if (entry.name.endsWith(".md")) output.push(fullPath);
  }
  return output.sort();
}

function stripCode(text: string): string {
  return text
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`\n]+`/g, "")
    .replace(/^---\n[\s\S]*?\n---/m, "");
}

function visibleWords(text: string): string[] {
  return stripCode(text)
    .replace(/https?:\/\/\S+/g, "")
    .split(/[^A-Za-z가-힣]+/)
    .map((word) => word.trim())
    .filter(Boolean);
}

function validateMarkdown(filePath: string): void {
  const text = readFileSync(filePath, "utf8");
  const visible = stripCode(text);
  const hangulCount = (visible.match(/[가-힣]/g) ?? []).length;
  const latinWords = visibleWords(text).filter((word) => /^[A-Za-z][A-Za-z-]*$/.test(word));
  const koreanWords = visibleWords(text).filter((word) => /[가-힣]/.test(word));
  const relativePath = rel(filePath);

  if (hangulCount < 40) {
    failures.push(`${relativePath}: 한국어 본문이 너무 적습니다`);
  }

  if (latinWords.length > koreanWords.length * 1.2 + 30) {
    failures.push(`${relativePath}: 영어 단어 비중이 한국어보다 높습니다`);
  }

  for (const line of text.split(/\r?\n/)) {
    const heading = line.match(/^#{1,6}\s+(.+)$/)?.[1]?.replace(/\s+#*$/, "").trim();
    if (!heading) continue;
    if (/[가-힣]/.test(heading)) continue;
    if (allowedEnglishOnlyHeadings.has(heading)) continue;
    if (/^[-`./A-Za-z0-9_<>:$]+$/.test(heading)) continue;
    failures.push(`${relativePath}: 영어 전용 제목을 한국어로 바꾸세요: ${heading}`);
  }
}

if (!existsSync(skillsRoot) || !statSync(skillsRoot).isDirectory()) {
  failures.push("skills directory not found");
} else {
  for (const filePath of walkMarkdown(skillsRoot)) validateMarkdown(filePath);
}

if (failures.length) {
  console.error("Korean Markdown validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log("Korean Markdown validation passed");
