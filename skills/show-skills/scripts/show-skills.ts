#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";

type SkillInfo = {
  name: string;
  category: string;
  description: string;
  shortDescription: string;
  state: string;
  risk: string;
  reviewed: string;
  skillPath: string;
  htmlPath: string;
  snippetPath: string;
};

const args = process.argv.slice(2);
const explicitRoot = valueFor("--root") ?? process.env.SKILLS_ROOT;
const catalog = findCatalogRoot(explicitRoot ? path.resolve(explicitRoot) : process.cwd());
const repoRoot = catalog.root;
const skillsRoot = catalog.skillsRoot;
const skillPathPrefix = catalog.pathPrefix;
const compact = args.includes("--compact");
const formatArg = valueFor("--format") ?? "markdown";
const categoryFilter = valueFor("--category");

const categoryOrder = [
  "탐색",
  "스킬 운영",
  "구현과 구조",
  "리뷰와 QA",
  "문서와 커밋",
  "기타",
];

const categoryBySkill: Record<string, string> = {
  "show-skills": "탐색",
  "web-research": "탐색",
  "skill-to-html": "스킬 운영",
  "skill-update": "스킬 운영",
  "sync-docs": "스킬 운영",
  "agent-improvement-loop": "스킬 운영",
  "karpathy-thinkings": "구현과 구조",
  "project-structure": "구현과 구조",
  "cmux-automation": "스킬 운영",
  "atomic-committer": "문서와 커밋",
  "browser-qa": "리뷰와 QA",
  "code-review": "리뷰와 QA",
  "design-review": "리뷰와 QA",
};

const summaryBySkill: Record<string, string> = {
  "show-skills": "현재 스킬 목록을 카테고리별로 보여주고 조합을 추천",
  "web-research": "최신 정보, 출처 검증, 추천, 기술 문서 조사",
  "skill-to-html": "스킬의 사람용 diagram-rich HTML guide 생성",
  "skill-update": "기존 스킬 패키지를 references, validator, docs까지 함께 유지보수",
  "sync-docs": "README, AGENTS, docs, snippets, history 충돌과 stale 설명 정리",
  "agent-improvement-loop": "스킬 호출성, 검증, 문서 정합성, repo 품질 개선 루프",
  "karpathy-thinkings": "추측, 과설계, 주변 리팩터링을 줄이는 구현 discipline",
  "project-structure": "frontend, backend, monorepo, desktop app 구조와 기본 stack 결정",
  "cmux-automation": "cmux hook, tab/status, session board 자동화",
  "atomic-committer": "secret guard 후 atomic commit 단위로 나누고 조건부 push",
  "browser-qa": "브라우저 렌더링, console, network, viewport, accessibility 검증",
  "code-review": "findings-first 코드 리뷰와 회귀/테스트/보안 위험 점검",
  "design-review": "Interline 기준 UI 위계, 밀도, 타이포그래피, 상태 리뷰",
};

function valueFor(flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index === -1) return undefined;
  return args[index + 1];
}

function hasSkillDirs(dir: string): boolean {
  try {
    return readdirSync(dir).some((name) => {
      const fullPath = path.join(dir, name);
      return statSync(fullPath).isDirectory() && existsSync(path.join(fullPath, "SKILL.md"));
    });
  } catch {
    return false;
  }
}

function findCatalogRoot(start: string): { root: string; skillsRoot: string; pathPrefix: string } {
  let current = path.resolve(start);
  while (true) {
    const nestedSkills = path.join(current, "skills");
    if (existsSync(nestedSkills) && hasSkillDirs(nestedSkills)) {
      return { root: current, skillsRoot: nestedSkills, pathPrefix: "skills/" };
    }

    if (hasSkillDirs(current)) {
      const parent = path.dirname(current);
      if (
        path.basename(current) === "skills" &&
        (existsSync(path.join(parent, "history/skills.md")) || existsSync(path.join(parent, "README.md")))
      ) {
        return { root: parent, skillsRoot: current, pathPrefix: "skills/" };
      }
      return { root: current, skillsRoot: current, pathPrefix: "" };
    }

    const parent = path.dirname(current);
    if (existsSync(path.join(current, "SKILL.md")) && hasSkillDirs(parent)) {
      return { root: parent, skillsRoot: parent, pathPrefix: "" };
    }

    if (parent === current) {
      return { root: path.resolve(start), skillsRoot: path.join(path.resolve(start), "skills"), pathPrefix: "skills/" };
    }
    current = parent;
  }
}

function read(relativePath: string): string {
  return readFileSync(path.join(repoRoot, relativePath), "utf8");
}

function parseFrontmatter(text: string): Record<string, string> {
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};
  const fields: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (field) fields[field[1]] = field[2].replace(/^["']|["']$/g, "");
  }
  return fields;
}

function parseShortDescription(yamlPath: string): string {
  if (!existsSync(path.join(repoRoot, yamlPath))) return "";
  const text = read(yamlPath);
  return text.match(/short_description:\s*["']?([^"'\n]+)["']?/)?.[1]?.trim() ?? "";
}

function parseHistory(): Map<string, { state: string; risk: string; reviewed: string }> {
  const output = new Map<string, { state: string; risk: string; reviewed: string }>();
  const historyPath = "history/skills.md";
  if (!existsSync(path.join(repoRoot, historyPath))) return output;
  for (const line of read(historyPath).split(/\r?\n/)) {
    const match = line.match(/^\| `([^`]+)` \| `([^`]+)` \| ([^|]+) \| ([^|]+) \|/);
    if (!match) continue;
    output.set(match[1], {
      state: match[2].trim(),
      risk: match[3].trim(),
      reviewed: match[4].trim(),
    });
  }
  return output;
}

function discoverSkills(): SkillInfo[] {
  const history = parseHistory();
  if (!existsSync(skillsRoot)) return [];

  return readdirSync(skillsRoot)
    .filter((name) => {
      const fullPath = path.join(skillsRoot, name);
      return statSync(fullPath).isDirectory() && existsSync(path.join(fullPath, "SKILL.md"));
    })
    .map((folder) => {
      const skillPath = `${skillPathPrefix}${folder}/SKILL.md`;
      const htmlPath = `${skillPathPrefix}${folder}/skill.html`;
      const snippetPath = `project-snippets/${folder}.md`;
      const frontmatter = parseFrontmatter(read(skillPath));
      const name = frontmatter.name ?? folder;
      const registry = history.get(name);
      return {
        name,
        category: categoryBySkill[name] ?? "기타",
        description: frontmatter.description ?? "",
        shortDescription:
          summaryBySkill[name] ||
          parseShortDescription(`${skillPathPrefix}${folder}/agents/openai.yaml`) ||
          summarize(frontmatter.description ?? ""),
        state: registry?.state ?? "unknown",
        risk: registry?.risk ?? "unknown",
        reviewed: registry?.reviewed ?? "unknown",
        skillPath,
        htmlPath,
        snippetPath,
      };
    })
    .filter((skill) => !categoryFilter || skill.category === categoryFilter || skill.name === categoryFilter)
    .sort((a, b) => {
      const categoryDelta = categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
      if (categoryDelta !== 0) return categoryDelta;
      return a.name.localeCompare(b.name);
    });
}

function summarize(description: string): string {
  return description.split(/[.!?]\s/)[0]?.slice(0, 120) ?? "";
}

function markdown(skills: SkillInfo[]): string {
  const lines: string[] = [];
  lines.push("# 현재 스킬 목록");
  lines.push("");
  lines.push(`총 ${skills.length}개 스킬. Source: \`${skillPathPrefix || "./"}*/SKILL.md\`${existsSync(path.join(repoRoot, "history/skills.md")) ? ", `history/skills.md`" : ""}.`);
  lines.push("");

  for (const category of categoryOrder) {
    const group = skills.filter((skill) => skill.category === category);
    if (!group.length) continue;
    lines.push(`## ${category}`);
    lines.push("");
    lines.push("| Skill | State | When to use | Paths |");
    lines.push("| --- | --- | --- | --- |");
    for (const skill of group) {
      const label = compact ? skill.shortDescription : skill.description;
      lines.push(
        `| \`${skill.name}\` | \`${skill.state}\` / ${skill.risk} | ${escapePipes(label)} | [SKILL.md](${skill.skillPath}) · [skill.html](${skill.htmlPath}) |`,
      );
    }
    lines.push("");
  }

  if (existsSync(path.join(repoRoot, "docs/skill-catalog.md"))) {
    lines.push("자세한 정적 카탈로그: `docs/skill-catalog.md`");
  } else {
    lines.push("정적 카탈로그가 없으면 이 live listing을 source of truth로 사용한다.");
  }
  return lines.join("\n");
}

function escapePipes(value: string): string {
  return value.replace(/\|/g, "\\|").replace(/\s+/g, " ").trim();
}

const skills = discoverSkills();

if (formatArg === "json") {
  process.stdout.write(`${JSON.stringify(skills, null, 2)}\n`);
} else {
  process.stdout.write(`${markdown(skills)}\n`);
}
