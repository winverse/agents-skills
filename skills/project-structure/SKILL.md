---
name: project-structure
description: "frontend, backend, full-stack monorepo, desktop app, infrastructure-aware project folder structure와 folder-local AGENTS.md index를 선택·생성·표준화·리팩터링할 때 사용한다."
---

# 프로젝트 구조

이 스킬은 새 프로젝트나 큰 구조 변경에서 folder boundary, env, codegen, DB, test, security, health/readiness, observability, infra handoff를 한 번에 정리한다. raw product discovery는 먼저 `project-workflow`가 처리하고, 이 스킬은 구조 선택이 구체화된 뒤 호출한다.

## 첫 행동

- 사용자의 stack 선택이 명확하지 않으면 compact numeric choices로 확인한다.
- 기존 repo가 있으면 현재 구조와 package manager를 먼저 읽는다.
- 사용자가 infra를 요청하지 않았으면 Pulumi/AWS/Docker 배포 구조를 추가하지 않는다.

## 기본 stack

명시가 없으면 Bun, Turborepo, Next.js, NestJS with Fastify, GraphQL, urql, GraphQL Code Generator, PostgreSQL + Drizzle, Panda CSS with headless UI, Tauri, Zod env validation을 기본값으로 둔다. infra 요청 시 Pulumi, Docker, AWS ECR/ECS Fargate를 기본 경로로 둔다.

## 보안과 도구 경계

- agent tool, MCP, external API, DB shell, migration, deploy script, destructive command, secret, scrubbed artifact boundary를 tree에 표시한다.
- Supabase service-role key와 MongoDB URI는 server-only로 둔다.
- generated artifact와 source artifact를 섞지 않는다.

## 구조 workflow

1. 제품/도메인 언어와 runtime 요구를 확인한다.
2. app, package, infra, docs boundary를 고른다.
3. env, codegen, DB migration, test, health/readiness, observability 위치를 정한다.
4. 의미 있는 boundary folder에 짧은 `AGENTS.md` index를 둔다.
5. 최종 tree와 validation command를 함께 제시한다.

## output shape 기준

```text
선택한 구조
- <stack/runtime/db/infra>

폴더 트리
- <tree>

경계
- env/codegen/db/test/security/tool/infra

검증
- <commands>
```
