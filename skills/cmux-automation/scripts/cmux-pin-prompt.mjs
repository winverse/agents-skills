#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import process from "node:process";

async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  return Buffer.concat(chunks).toString("utf8");
}

async function readInput() {
  const encodedPayload = process.env.CMUX_PROMPT_PAYLOAD_B64;
  if (encodedPayload) {
    try {
      return Buffer.from(encodedPayload, "base64").toString("utf8");
    } catch {
      return "";
    }
  }
  return readStdin();
}

function firstString(...values) {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value;
  }
  return "";
}

function textFromContent(content) {
  if (typeof content === "string") return content;
  if (!Array.isArray(content)) return "";

  return content
    .map((part) => {
      if (typeof part === "string") return part;
      if (part && typeof part === "object") {
        return firstString(part.text, part.content, part.value);
      }
      return "";
    })
    .filter(Boolean)
    .join(" ");
}

function promptFromPayload(payload) {
  const direct = firstString(
    payload.prompt,
    payload.user_prompt,
    payload.userPrompt,
    payload.message,
    payload.input,
    payload.text,
  );
  if (direct) return direct;

  return firstString(
    textFromContent(payload.content),
    textFromContent(payload.message?.content),
    textFromContent(payload.input?.content),
    payload.messages?.at?.(-1)?.content,
    textFromContent(payload.messages?.at?.(-1)?.content),
  );
}

function truncate(text, length) {
  return text.length <= length ? text : `${text.slice(0, length - 1)}...`;
}

function truncateGraphemes(text, length) {
  const chars = [...text];
  return chars.length <= length ? text : chars.slice(0, length).join("");
}

function titleLimit() {
  const raw = Number.parseInt(process.env.CMUX_PIN_PROMPT_TITLE_CHARS ?? "", 10);
  return Number.isFinite(raw) && raw >= 8 && raw <= 40 ? raw : 16;
}

function trimKoreanParticle(word) {
  const trimmed = word.replace(
    /(으로|에서|에게|께서|까지|부터|보다|처럼|은|는|이|가|을|를|에|로|도|만|와|과)$/u,
    "",
  );
  return trimmed.length >= 2 ? trimmed : word;
}

function compactTitle(prompt) {
  const normalized = prompt
    .replace(/https?:\/\/\S+/g, "link")
    .replace(/[`"'“”‘’]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^[?!.,。！？\s]+/u, "")
    .replace(/^(아니|근데|그리고|음|오|ㅇㅇ+|좋아|이제|그럼|저기)\s*/iu, "")
    .replace(/[?!.,。！？]+$/u, "");

  const firstClause = normalized
    .split(/(?:[?!.,。！？])|(?:\s+그리고\s+)|(?:\s+근데\s+)/u)[0]
    ?.trim();

  const words = (firstClause || normalized)
    .split(/\s+/)
    .map(trimKoreanParticle)
    .filter((word) => word && !/^(좀|왜|어떻게|무엇|뭐|이거|그거|저거|내가|네가|제가)$/u.test(word));

  const candidate = words.length > 1 ? words.slice(0, 4).join(" ") : firstClause || normalized;
  return truncateGraphemes(candidate || "질문", titleLimit());
}

function inCmux() {
  return Boolean(
    process.env.CMUX_WORKSPACE_ID ||
      process.env.CMUX_SURFACE_ID ||
      process.env.CMUX_TAB_ID ||
      process.env.CMUX_SOCKET_PATH,
  );
}

function readIdentify() {
  if (process.env.CMUX_SURFACE_ID) {
    try {
      const raw = execFileSync("cmux", ["identify", "--surface", process.env.CMUX_SURFACE_ID], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "ignore"],
        timeout: 2000,
      });
      return JSON.parse(raw);
    } catch {
      // Fall through to plain identify.
    }
  }

  try {
    // cmux identify is the fallback when surface env targeting is unavailable.
    const raw = execFileSync("cmux", ["identify"], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      timeout: 2000,
    });
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function canUseFastEnvTarget() {
  return Boolean(
    process.env.CMUX_SURFACE_ID &&
      process.env.CMUX_WORKSPACE_ID &&
      process.env.CMUX_PIN_PROMPT_SCOPE !== "workspace",
  );
}

function currentTabArgs(info) {
  if (process.env.CMUX_SURFACE_ID) {
    return ["--surface", process.env.CMUX_SURFACE_ID];
  }

  const tabRef = info?.caller?.tab_ref ?? info?.focused?.tab_ref;
  return tabRef ? ["--tab", tabRef] : [];
}

function currentWorkspaceRef(info) {
  return (
    info?.caller?.workspace_ref ??
    info?.focused?.workspace_ref ??
    process.env.CMUX_WORKSPACE_ID ??
    ""
  );
}

function workspaceSurfaceTargets(info) {
  if (process.env.CMUX_PIN_PROMPT_SCOPE !== "workspace") return [];

  const workspace = currentWorkspaceRef(info);
  if (!workspace) return [];

  try {
    const raw = execFileSync("cmux", ["tree", "--workspace", workspace], {
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
      timeout: 2000,
    });

    return [...raw.matchAll(/\bsurface\s+(surface:\d+)\s+\[terminal\]/g)].map((match) => [
      "--surface",
      match[1],
    ]);
  } catch {
    return [];
  }
}

function uniqueTargets(targets) {
  const seen = new Set();
  return targets.filter((target) => {
    const key = target.join("\0");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function runCmux(args) {
  execFileSync("cmux", args, {
    stdio: "ignore",
    timeout: 2000,
  });
}

const input = await readInput();
let payload = {};
try {
  payload = JSON.parse(input || "{}");
} catch {
  process.exit(0);
}

if (!inCmux()) process.exit(0);

const prompt = promptFromPayload(payload).replace(/\s+/g, " ").trim();
if (!prompt) process.exit(0);

const title = compactTitle(prompt);
const status = truncate(prompt, 500);
const info = canUseFastEnvTarget() ? {} : readIdentify();

try {
  const targets = uniqueTargets([currentTabArgs(info), ...workspaceSurfaceTargets(info)]).filter(
    (target) => target.length,
  );

  for (const target of targets) {
    try {
      runCmux(["rename-tab", ...target, title]);
    } catch {
      // Keep prompt pinning non-blocking if one surface disappears.
    }
  }

  const workspace = currentWorkspaceRef(info);
  const workspaceArgs = workspace ? ["--workspace", workspace] : [];
  runCmux([
    "set-status",
    "current-question",
    status,
    ...workspaceArgs,
    "--icon",
    "pin",
    "--color",
    "#2563eb",
  ]);
} catch {
  process.exit(0);
}
