# folder-local AGENTS.md 기준

## 목적

folder-local `AGENTS.md`는 root rule 복사가 아니라 boundary index다. agent가 해당 폴더에서 무엇을 읽고 무엇을 건드리지 말아야 하는지 빠르게 알게 한다.

## 포함할 항목

- 목적
- local map
- do-not-change boundary
- related skills
- validation commands

## 추천 대상

- `apps/web`
- `apps/api`
- `packages/db`
- `packages/env`
- `infra/pulumi`

## 금지

root AGENTS 전체를 복사하지 않는다. 폴더 책임과 검증 명령만 짧게 둔다.
