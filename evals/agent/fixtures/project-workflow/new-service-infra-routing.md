# Workflow Fixture: New Service Infrastructure Routing

Skill: project-workflow
Mode: Discovery

Prompt shape:
- 새 서비스 만들고 Docker/AWS/Pulumi 배포 구조까지 잡고 싶어.

Next step:
- Discovery first.
- CONTEXT.md before infra tree.
- ADR before PRD/issues.
- project-structure proposes infra only after service shape is constrained.

Infra questions:
- project kind, API, DB, auth, ECS vs EC2, public entrypoint, domain/TLS, CI provider, secret storage, smoke endpoint.

Validation
- Do not generate Docker/AWS/Pulumi tree from a raw service idea.
