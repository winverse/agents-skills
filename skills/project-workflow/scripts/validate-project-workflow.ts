#!/usr/bin/env node
import { validateSkillPackage } from "../../../scripts/validate-skill-package.ts";

validateSkillPackage("project-workflow", process.argv[2]);
