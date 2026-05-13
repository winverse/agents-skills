#!/usr/bin/env node
import { validateSkillPackage } from "../../../scripts/validate-skill-package.ts";

validateSkillPackage("show-skills", process.argv[2]);
