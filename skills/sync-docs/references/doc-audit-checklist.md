# 문서 감사 체크리스트

## claim ledger 기준

각 claim에 대해 source file, dependent file, 검증 방법을 적는다. 예: "모든 skill에는 skill.html이 있다"는 filesystem과 validator로 확인한다.

## common conflict types 기준

- README에는 있는 skill이 AGENTS에는 없음
- snippet path가 이전 폴더를 가리킴
- history lifecycle과 실제 validator 상태가 다름
- HTML은 한국어인데 Markdown은 영어로 남아 있음
- validator command가 README에 빠짐

## fix strategy 기준

1. 실행 가능한 source를 먼저 확인한다.
2. stale 문서를 최소 변경으로 맞춘다.
3. 불명확한 정책 변경은 사용자에게 묻는다.
4. validator를 추가해 drift가 반복되지 않게 한다.

## validation pass 기준

```bash
node scripts/validate-korean-markdown.ts .
node scripts/validate-skill-html.ts .
node scripts/validate-skill-repo.ts .
node scripts/run-agent-evals.ts
```
