#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const allowedFrontmatterKeys = new Set([
  "name",
  "description",
  "license",
  "allowed-tools",
  "metadata",
]);
const maxSkillNameLength = 64;
const maxDescriptionLength = 1024;

function rel(filePath: string): string {
  return path.relative(root, filePath).split(path.sep).join("/");
}

function discoverSkillDirs(): string[] {
  const skillsRoot = path.join(root, "skills");
  if (!existsSync(skillsRoot)) return [];
  return readdirSync(skillsRoot)
    .filter((name) => {
      const fullPath = path.join(skillsRoot, name);
      return statSync(fullPath).isDirectory() && existsSync(path.join(fullPath, "SKILL.md"));
    })
    .map((name) => `skills/${name}`)
    .sort();
}

function resolveSkillArg(skillArg: string): string {
  if (existsSync(path.join(root, skillArg, "SKILL.md"))) return skillArg;
  const skillsRelativePath = path.join("skills", skillArg);
  if (existsSync(path.join(root, skillsRelativePath, "SKILL.md"))) {
    return skillsRelativePath;
  }
  return skillArg;
}

function stripMatchingQuotes(value: string): string {
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }
  return value;
}

function stripIndent(line: string): string {
  return line.replace(/^\s{2}/, "");
}

function parseFrontmatter(text: string): Map<string, string> {
  const fields = new Map<string, string>();
  const lines = text.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    if (/^\s/.test(line)) continue;

    const match = line.match(/^([A-Za-z0-9_-]+):(?:\s*(.*))?$/);
    if (!match) continue;

    const key = match[1];
    const rawValue = match[2] ?? "";

    if (rawValue === "|" || rawValue === ">") {
      const blockLines: string[] = [];
      let cursor = index + 1;
      while (cursor < lines.length && (/^\s/.test(lines[cursor]) || !lines[cursor].trim())) {
        blockLines.push(stripIndent(lines[cursor]));
        cursor += 1;
      }
      fields.set(key, rawValue === ">" ? blockLines.join(" ").trim() : blockLines.join("\n").trim());
      index = cursor - 1;
      continue;
    }

    fields.set(key, stripMatchingQuotes(rawValue.trim()));
  }

  return fields;
}

function validateSkill(skillArg: string): string[] {
  const skillPath = path.resolve(root, skillArg);
  const skillMd = path.join(skillPath, "SKILL.md");
  const failures: string[] = [];

  if (!existsSync(skillMd)) {
    return [`${rel(skillPath)}: SKILL.md not found`];
  }

  const content = readFileSync(skillMd, "utf8");
  if (!content.startsWith("---\n")) {
    return [`${rel(skillMd)}: No YAML frontmatter found`];
  }

  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    return [`${rel(skillMd)}: Invalid frontmatter format`];
  }

  const frontmatter = parseFrontmatter(match[1]);
  const keys = [...frontmatter.keys()];
  const unexpectedKeys = keys.filter((key) => !allowedFrontmatterKeys.has(key));
  if (unexpectedKeys.length) {
    failures.push(
      `${rel(skillMd)}: Unexpected frontmatter key(s): ${unexpectedKeys.sort().join(", ")}`,
    );
  }

  const name = frontmatter.get("name")?.trim();
  if (!name) {
    failures.push(`${rel(skillMd)}: Missing non-empty name`);
  } else {
    if (!/^[a-z0-9-]+$/.test(name)) {
      failures.push(`${rel(skillMd)}: name should be hyphen-case lowercase text`);
    }
    if (name.startsWith("-") || name.endsWith("-") || name.includes("--")) {
      failures.push(`${rel(skillMd)}: name cannot start/end with hyphen or contain --`);
    }
    if (name.length > maxSkillNameLength) {
      failures.push(`${rel(skillMd)}: name is too long (${name.length}/${maxSkillNameLength})`);
    }
  }

  const description = frontmatter.get("description")?.trim();
  if (!description) {
    failures.push(`${rel(skillMd)}: Missing non-empty description`);
  } else {
    if (/[<>]/.test(description)) {
      failures.push(`${rel(skillMd)}: description cannot contain angle brackets`);
    }
    if (description.length > maxDescriptionLength) {
      failures.push(
        `${rel(skillMd)}: description is too long (${description.length}/${maxDescriptionLength})`,
      );
    }
  }

  return failures;
}

const skillArgs = process.argv.slice(2);
const targets = skillArgs.length ? skillArgs.map(resolveSkillArg) : discoverSkillDirs();
const failures = targets.flatMap(validateSkill);

if (failures.length) {
  console.error("skill validation failed:");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(targets.length === 1 ? "Skill is valid!" : "All skills are valid!");
