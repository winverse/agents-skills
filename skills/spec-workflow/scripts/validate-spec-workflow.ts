#!/usr/bin/env node
import { validateSkillPackage } from "../../../scripts/validate-skill-package.ts";

validateSkillPackage("spec-workflow", process.argv[2]);
