# Next.js frontend 구조

## 기본 tree

```text
apps/web/
  app/
  components/
  features/
  graphql/
  styles/
  tests/
```

## UI policy 기준

Panda CSS와 headless UI를 기본으로 둔다. domain feature는 `features/` 아래에 모으고, shared component는 작은 범위에서만 승격한다.

## GraphQL

urql client와 generated artifact 위치를 명확히 둔다. query document, generated type, runtime client를 섞지 않는다.

## validation

lint, typecheck, test, build, browser smoke를 final tree에 함께 적는다.
