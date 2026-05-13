#!/usr/bin/env node
import { validateSkillPackage } from "../../../scripts/validate-skill-package.ts";

validateSkillPackage("project-structure", process.argv[2]);
