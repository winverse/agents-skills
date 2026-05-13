#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

function gitRoot(cwd) {
  try {
    return execFileSync("git", ["rev-parse", "--show-toplevel"], {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      timeout: 2000,
    }).trim();
  } catch {
    return "";
  }
}

const localRepoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

if (path.resolve(gitRoot(process.cwd()) || process.cwd()) !== localRepoRoot) {
  process.exit(0);
}

await import("../../skills/cmux-automation/scripts/cmux-pin-prompt.mjs");
