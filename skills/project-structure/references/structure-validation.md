# 구조 검증

## final tree checklist 기준

- app, package, infra, docs boundary가 보이는가
- env와 secret boundary가 보이는가
- GraphQL generated artifact 위치가 보이는가
- Drizzle migration 위치가 보이는가
- test, health/readiness, observability 위치가 보이는가
- folder-local `AGENTS.md`가 필요한 boundary에 있는가

## validation commands 기준

```bash
bun lint
bun typecheck
bun test
bun build
bun db:check
```

프로젝트가 Bun을 쓰지 않으면 실제 package manager 명령으로 바꾼다.
