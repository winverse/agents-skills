# Skill History

이 파일은 shared skill의 생명주기와 큰 변경만 기록하는 ledger다. 작은 문구 수정이나 단순 스타일 조정은 기록하지 않는다.

## Current Registry

| Skill | State | Risk tier | Last reviewed | Notes |
| --- | --- | --- | --- | --- |
| `web-research` | `critical` | high | 2026-05-11 | 현재성, 출처 검증, 추천, 규정, 기술 문서 조사에 쓰는 핵심 조사 스킬 |
| `skill-to-html` | `active` | medium | 2026-05-11 | `SKILL.md` 옆의 human visual guide를 만드는 시각화 스킬 |
| `karpathy-thinkings` | `active` | medium | 2026-05-12 | Karpathy식 코딩 에이전트 사고로 추측, 과설계, 주변 리팩터링, 약한 검증을 줄이는 구현 스킬 |
| `skill-update` | `active` | medium | 2026-05-11 | 기존 공유 스킬의 source, references, validator, visual guide, snippets, docs, history를 함께 맞추는 유지보수 스킬 |
| `atomic-committer` | `active` | medium | 2026-05-11 | dirty git tree를 atomic commit 단위로 나눠 커밋하고 조건부 push를 수행하는 스킬 |
| `project-structure` | `active` | medium | 2026-05-11 | frontend, backend, full-stack monorepo, desktop app 구조와 기본 stack/env 정책을 정하는 스킬 |
| `sync-docs` | `active` | medium | 2026-05-11 | README, AGENTS, docs, snippets, history, skill 파일을 비교해 문서 최신화와 충돌 정리를 수행하는 스킬 |

## Event Log

| Date | Skill | Event | Lifecycle | Reason | Validation | Follow-up |
| --- | --- | --- | --- | --- | --- | --- |
| 2026-05-11 | `web-research` | Web research method hardened | `active -> critical` | query fan-out, source ledger, evidence scoring, stop rules, eval prompts, static validator 기준을 추가했다. | repo TS validator, skill-specific validator | broad topic eval runner는 필요해지면 추가한다. |
| 2026-05-11 | `skill-to-html` | HTML guide standard hardened | `active -> active` | 단순 문서 분할이 아니라 decision matrix, flowchart, chart, resource map 중심으로 HTML을 만들도록 기준을 정리했다. | repo TS validator, skill-specific validator | 새 skill이 늘면 visual pattern 예시를 보강한다. |
| 2026-05-12 | `karpathy-thinkings` | Skill added | `none -> active` | Karpathy식 코딩 에이전트 사고를 직접 쓰는 구현 스킬을 추가했다. 모호함 노출, 단순함, 외과적 변경, 성공 기준 검증을 핵심 원칙으로 둔다. | repo TS validator, skill-specific validator, repo validator | 실제 코딩 작업에서 질문 과다와 검증 강도의 균형을 점검한다. |
| 2026-05-11 | `skill-update` | Skill added | `none -> active` | 기존 스킬 수정 시 `SKILL.md`, references, validator, `agents/openai.yaml`, `skill.html`, snippets, docs, history를 한 번에 맞추는 상위 유지보수 스킬을 추가했다. | repo TS validator, skill-specific validator, repo validator | 실제 스킬 업데이트 요청에서 package completeness 품질을 점검한다. |
| 2026-05-11 | `changeset-committer` | Skill added | `none -> active` | 커밋 요청 시 변경사항을 changeset 단위로 분류하고, 영어 prefix + 한글 메시지로 커밋하며, remote가 있을 때만 push하도록 새 스킬을 추가했다. | repo TS validator, skill-specific validator | 실제 프로젝트 커밋에서 grouping 품질을 점검한다. |
| 2026-05-11 | `atomic-committer` | Skill renamed | `active -> active` | 기존 `changeset-committer` slug와 표시 이름을 Git 관례에 더 가까운 `atomic-committer` / Atomic Committer로 변경했다. | repo TS validator, skill-specific validator, repo validator | none |
| 2026-05-11 | `project-structure` | Skill added | `none -> active` | 프로젝트 종류를 숫자로 고르고 Bun, Turborepo, Next.js, NestJS Fastify, GraphQL, urql, Drizzle, Zod env, Tauri 기본값으로 일관된 구조를 만들도록 새 스킬을 추가했다. | repo TS validator, skill-specific validator, repo validator | 실제 신규 프로젝트 scaffold에서 구조 적합성을 점검한다. |
| 2026-05-11 | `sync-docs` | Skill added | `none -> active` | 문서끼리 비교해 stale 설명, 누락된 연결, 충돌하는 규칙을 정리하고 source of truth가 불명확하면 사용자에게 묻는 문서 최신화 스킬을 추가했다. | repo TS validator, skill-specific validator, repo validator | 실제 문서 audit에서 질문 분기 품질을 점검한다. |
| 2026-05-11 | repo | Lifecycle ledger added | `none -> active process` | inspector scratch와 영구 history를 분리하고, skill state를 관리하기 위한 기준을 추가했다. | docs review | 첫 archived skill이 생기면 archive 이동 절차를 실제 사례로 보강한다. |
| 2026-05-11 | repo | Validator scripts moved to TypeScript | `active process -> active process` | Node 22+ 기준에서 validator는 특별한 런타임 제약이 없으면 `.ts`를 기본으로 쓰도록 정했다. | repo validator, skill-specific validators | Codex hook처럼 호환성이 중요한 파일은 `.mjs` 예외를 유지한다. |
| 2026-05-11 | repo | Base validator and hook corrected | `active process -> active process` | Python 직접 실행 문서를 repo-owned TypeScript validator로 바꾸고, Codex hook이 read-only payload의 `SKILL.md` 문자열을 변경으로 오인하지 않게 실제 dirty skill만 본다. | repo TS validator, repo validator | hook review hash는 설정 변경 후 Codex에서 다시 승인될 수 있다. |
| 2026-05-11 | repo | Skill HTML hook auto-run enabled | `active process -> active process` | stale `skill.html` 감지 시 reminder만 주던 hook을 별도 `codex exec`로 `skill-to-html`을 실행하는 자동 갱신 방식으로 바꿨다. | hook dry-run, node syntax check, repo validator | 새 hook command는 Codex `/hooks`에서 다시 승인해야 적용될 수 있다. |
| 2026-05-11 | repo | Hook validation added | `active process -> active process` | 스킬 생성/수정 후 hook이 repo 기본 validator, 변경된 스킬의 custom validator, repo validator를 실행하고 실패 결과를 additional context로 알려주도록 했다. | hook dry-run, node syntax check, repo validator | validator 실패는 작업 중간 상태를 막지 않도록 advisory context로만 전달한다. |
| 2026-05-11 | repo | Documentation consistency validation added | `active process -> active process` | repo validator가 현재 스킬 목록과 README, AGENTS, project snippets, history registry, validator 명령의 이름과 경로 일치 여부를 검사하도록 보강했다. | repo validator | 새 스킬이나 rename 시 문서 누락을 validator에서 잡는다. |
| 2026-05-11 | repo | Docs review findings resolved | `active process -> active process` | inspector 기록에 남은 project setup, base snippet, README 검증 흐름, skill-to-html 경로 예시를 현재 repo 구조에 맞게 정리했다. | repo validator, skill-to-html validators, Chrome headless render | none |
