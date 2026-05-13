import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import process from "node:process";

export function validateSkillPackage(expectedName: string, skillRootArg?: string): void {
  const skillRoot = path.resolve(skillRootArg ?? `skills/${expectedName}`);
  const failures: string[] = [];

  function read(relativePath: string): string {
    return readFileSync(path.join(skillRoot, relativePath), "utf8");
  }

  function requireFile(relativePath: string): void {
    if (!existsSync(path.join(skillRoot, relativePath))) {
      failures.push(`missing required file: ${relativePath}`);
    }
  }

  requireFile("SKILL.md");
  requireFile("skill.html");
  requireFile("agents/openai.yaml");

  if (existsSync(path.join(skillRoot, "SKILL.md"))) {
    const skill = read("SKILL.md");
    if (!skill.startsWith("---\n")) failures.push("SKILL.md must start with YAML frontmatter");
    if (!skill.includes(`name: ${expectedName}`)) {
      failures.push(`SKILL.md frontmatter must include name: ${expectedName}`);
    }
    if (!/[가-힣]/.test(skill)) failures.push("SKILL.md must include Korean guidance");
  }

  if (existsSync(path.join(skillRoot, "skill.html"))) {
    const html = read("skill.html");
    if (!html.includes("SKILL.md")) failures.push("skill.html must link or mention SKILL.md");
    if (!/[가-힣]/.test(html)) failures.push("skill.html must include Korean visible copy");
  }

  if (existsSync(path.join(skillRoot, "agents/openai.yaml"))) {
    const metadata = read("agents/openai.yaml");
    if (!metadata.includes("interface:")) failures.push("agents/openai.yaml must include interface");
    if (!metadata.includes(`$${expectedName}`)) {
      failures.push(`agents/openai.yaml default prompt must mention $${expectedName}`);
    }
  }

  if (failures.length) {
    console.error(`${expectedName} validation failed:`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exit(1);
  }

  console.log(`${expectedName} validation passed`);
}
