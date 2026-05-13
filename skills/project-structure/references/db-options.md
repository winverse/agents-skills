# 데이터베이스 선택지

## 선택 기준

| 선택 | 사용 시점 | 주의 |
| --- | --- | --- |
| PostgreSQL + Drizzle | 기본 relational app | migration과 schema source를 분리 |
| Supabase Postgres | managed psql-compatible 요구 | service role key는 server-only |
| MongoDB + Atlas | document DB가 명확한 경우 | URI와 admin credential은 server-only |
| Redis | cache, queue, rate limit | app wrapper와 infra resource 경계 표시 |

## env rule 기준

DB URL, Redis URL, service key는 `.env.example`에는 placeholder만 둔다. live value는 commit하지 않는다.

## migration rule 기준

migration은 repeatable command와 rollback 위험을 함께 적는다. destructive migration은 approval boundary를 둔다.
