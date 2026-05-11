#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import process from "node:process";

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
}

function git(args, cwd) {
  return execFileSync("git", args, {
    cwd,
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  });
}

function gitRoot(cwd) {
  try {
    return git(["rev-parse", "--show-toplevel"], cwd).trim();
  } catch {
    return path.resolve(cwd);
  }
}

function toPosix(filePath) {
  return filePath.split(path.sep).join("/");
}

function parseGitStatus(root) {
  const status = git(["status", "--porcelain", "--untracked-files=all"], root);
  const entries = [];

  for (const line of status.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const code = line.slice(0, 2);
    let filePath = line.slice(3);
    if (filePath.includes(" -> ")) {
      filePath = filePath.split(" -> ").at(-1);
    }
    entries.push({ code, filePath });
  }

  return entries;
}

function skillDirFromPath(filePath) {
  const posix = toPosix(filePath);
  if (posix === "SKILL.md") return ".";
  if (!posix.endsWith("/SKILL.md")) return null;
  return posix.slice(0, -"/SKILL.md".length);
}

function collectPayloadSkillDirs(serializedPayload, root) {
  const dirs = new Set();
  const pattern = /(?:^|["'\s])([^"'\s]*SKILL\.md)(?=["'\s]|$)/g;

  for (const match of serializedPayload.matchAll(pattern)) {
    let filePath = match[1];
    if (path.isAbsolute(filePath)) {
      filePath = path.relative(root, filePath);
    }
    const dir = skillDirFromPath(filePath);
    if (dir) dirs.add(dir);
  }

  return dirs;
}

function collectDirtySkillDirs(entries) {
  const dirs = new Set();
  for (const entry of entries) {
    const dir = skillDirFromPath(entry.filePath);
    if (dir) dirs.add(dir);
  }
  return dirs;
}

function htmlPathForSkillDir(skillDir) {
  return skillDir === "." ? "skill.html" : `${skillDir}/skill.html`;
}

function hasDirtyPath(entries, targetPath) {
  return entries.some((entry) => entry.filePath === targetPath);
}

function additionalContext(eventName, context) {
  process.stdout.write(
    `${JSON.stringify({
      hookSpecificOutput: {
        hookEventName: eventName,
        additionalContext: context,
      },
    })}\n`,
  );
}

const input = await readStdin();
let payload = {};
try {
  payload = JSON.parse(input || "{}");
} catch {
  process.stdout.write("{}\n");
  process.exit(0);
}

const eventName = payload.hook_event_name ?? "PostToolUse";
const root = gitRoot(payload.cwd ?? process.cwd());
const entries = parseGitStatus(root);
const candidateDirs = new Set([
  ...collectPayloadSkillDirs(input, root),
  ...collectDirtySkillDirs(entries),
]);

const reminders = [];

for (const skillDir of [...candidateDirs].sort()) {
  const skillPath = skillDir === "." ? "SKILL.md" : `${skillDir}/SKILL.md`;
  const htmlPath = htmlPathForSkillDir(skillDir);
  const absoluteSkillPath = path.join(root, skillPath);
  const absoluteHtmlPath = path.join(root, htmlPath);

  if (!existsSync(absoluteSkillPath)) continue;
  if (hasDirtyPath(entries, htmlPath)) continue;

  reminders.push({
    skillDir,
    skillPath,
    htmlPath,
    htmlExists: existsSync(absoluteHtmlPath),
  });
}

if (reminders.length === 0) {
  process.stdout.write("{}\n");
  process.exit(0);
}

const lines = [
  "Codex hook reminder: a shared skill source instruction changed, but the matching human visual guide is not dirty.",
  "Before finalizing this task, use $skill-to-html at skill-to-html/SKILL.md for each affected skill folder and update the adjacent skill.html.",
  "",
];

for (const reminder of reminders) {
  lines.push(`- Skill source: ${reminder.skillPath}`);
  lines.push(
    `  Required guide: ${reminder.htmlPath}${reminder.htmlExists ? "" : " (missing)"}`,
  );
  lines.push(`  Target folder: ${reminder.skillDir}`);
}

additionalContext(eventName, lines.join("\n"));
