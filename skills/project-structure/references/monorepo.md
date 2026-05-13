# full-stack monorepo 구조

## 기본 tree

```text
apps/
  web/
  api/
packages/
  db/
  env/
  config/
  ui/
infra/
  pulumi/
```

## package roles 기준

- `packages/db`: Drizzle schema, migration, Redis boundary
- `packages/env`: server/client/shared env validation
- `packages/config`: eslint, tsconfig, shared tooling
- `packages/ui`: app 간 공유가 확실한 component만

## script policy 기준

root script는 orchestration만 하고, app/package script는 실제 작업을 가진다. generated artifact는 source와 구분한다.

이 구조는 여러 app과 shared package가 함께 움직일 때 책임을 분명히 하기 위한 기준이다. 새 package를 만들기 전에는 실제로 두 곳 이상에서 재사용되는지 확인한다.
