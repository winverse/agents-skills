# Saved Project Workflow Output: Workflow State Cache

Skill: project-workflow
Mode: Setup cache

Workflow State
- Path: `.scratch/new-product/workflow-state.md`
- Source primitives: Matt Pocock skills / grill-me -> selected; GStack plugin / office-hours -> selected; repo-local custom / project-structure -> skipped
- Authority docs: `.scratch/new-product/CONTEXT.md`, `docs/adr/0001-product-boundary.md`, `.scratch/new-product/PRD.md`, `design.md`
- Skipped questions: payment integration is out of scope for first usable slice
- Open questions: production data retention policy
- Tool/security gate: needs-info
- Next spec-workflow target: `.scratch/new-product/issues/001-first-usable-slice.md`

Validation
- workflow-state.md is a cache, not the source of truth.
- spec-workflow must read this state before repeating setup questions.
