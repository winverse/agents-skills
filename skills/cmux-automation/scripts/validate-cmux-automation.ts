#!/usr/bin/env node
import { validateSkillPackage } from "../../../scripts/validate-skill-package.ts";

validateSkillPackage("cmux-automation", process.argv[2]);
