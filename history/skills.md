# Skill History

이 파일은 shared skill의 생명주기와 큰 변경만 기록하는 ledger다. 작은 문구 수정이나 단순 스타일 조정은 기록하지 않는다.

## Current Registry

| Skill | State | Risk tier | Last reviewed | Notes |
| --- | --- | --- | --- | --- |
| `web-research` | `critical` | high | 2026-05-11 | 현재성, 출처 검증, 추천, 규정, 기술 문서 조사에 쓰는 핵심 조사 스킬 |
| `skill-to-html` | `active` | medium | 2026-05-11 | `SKILL.md` 옆의 human visual guide를 만드는 시각화 스킬 |
| `changeset-committer` | `active` | medium | 2026-05-11 | dirty git tree를 작업 단위로 나눠 커밋하고 조건부 push를 수행하는 스킬 |

## Event Log

| Date | Skill | Event | Lifecycle | Reason | Validation | Follow-up |
| --- | --- | --- | --- | --- | --- | --- |
| 2026-05-11 | `web-research` | Web research method hardened | `active -> critical` | query fan-out, source ledger, evidence scoring, stop rules, eval prompts, static validator 기준을 추가했다. | repo TS validator, skill-specific validator | broad topic eval runner는 필요해지면 추가한다. |
| 2026-05-11 | `skill-to-html` | HTML guide standard hardened | `active -> active` | 단순 문서 분할이 아니라 decision matrix, flowchart, chart, resource map 중심으로 HTML을 만들도록 기준을 정리했다. | repo TS validator, skill-specific validator | 새 skill이 늘면 visual pattern 예시를 보강한다. |
| 2026-05-11 | `changeset-committer` | Skill added | `none -> active` | 커밋 요청 시 변경사항을 changeset 단위로 분류하고, 영어 prefix + 한글 메시지로 커밋하며, remote가 있을 때만 push하도록 새 스킬을 추가했다. | repo TS validator, skill-specific validator | 실제 프로젝트 커밋에서 grouping 품질을 점검한다. |
| 2026-05-11 | repo | Lifecycle ledger added | `none -> active process` | inspector scratch와 영구 history를 분리하고, skill state를 관리하기 위한 기준을 추가했다. | docs review | 첫 archived skill이 생기면 archive 이동 절차를 실제 사례로 보강한다. |
| 2026-05-11 | repo | Validator scripts moved to TypeScript | `active process -> active process` | Node 22+ 기준에서 validator는 특별한 런타임 제약이 없으면 `.ts`를 기본으로 쓰도록 정했다. | repo validator, skill-specific validators | Codex hook처럼 호환성이 중요한 파일은 `.mjs` 예외를 유지한다. |
| 2026-05-11 | repo | Base validator and hook corrected | `active process -> active process` | Python 직접 실행 문서를 repo-owned TypeScript validator로 바꾸고, Codex hook이 read-only payload의 `SKILL.md` 문자열을 변경으로 오인하지 않게 실제 dirty skill만 본다. | repo TS validator, repo validator | hook review hash는 설정 변경 후 Codex에서 다시 승인될 수 있다. |
