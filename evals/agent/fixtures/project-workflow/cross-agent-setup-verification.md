# Workflow Fixture: Cross-Agent Setup Verification

Skill: project-workflow
Mode: Portability setup

Next step:
- Use the smallest adapter snippets.
- Use project-snippets/project-workflow.md when only workflow behavior is needed.
- Run Project Setup Verification before calling setup complete.

Verification report fields:
- targetInstructionFiles
- skillsRoot
- selectedSnippet
- linksValid
- skillHtmlReviewed
- globalInstallAllowed: false
- officialDocsChecked
- evalSeedAdded

Validation
- Do not install or symlink repo skills globally.
