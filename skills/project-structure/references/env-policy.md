# env 정책

## 원칙

- 모든 runtime env는 Zod로 검증한다.
- server-only secret과 client-exposed env를 파일과 이름으로 분리한다.
- `.env.example`에는 placeholder만 둔다.
- service role key, DB URI, token은 client bundle에 들어가지 않는다.

## 추천 위치

```text
packages/env/
  src/server.ts
  src/client.ts
  src/shared.ts
```

## 검증

app 시작 시 env parse가 실패하면 명확한 error를 내고 중단한다. CI에서는 example과 required key 목록이 drift되지 않는지 확인한다.
