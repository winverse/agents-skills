# 구조화 검색 참조

## core idea 기준

검색은 query 나열이 아니라 claim을 검증하는 과정이다. 질문을 concept block으로 나누고, 각 block에 source target과 stop rule을 둔다.

이 repo에서 `web-search`, `web search`, `웹서치`, `웹 검색`은 별도 스킬명이 아니라 `web-research`의 alias다.

## research budget router 기준

| 위험 | 처리 |
| --- | --- |
| 낮음 | official quick check |
| 중간 | query fan-out과 source comparison |
| 높음 | primary source, 최신 날짜, conflict ledger |
| recommendation | 가격, availability, review, safety 확인 |

## query fan-out 기준

- official term
- user term
- alias
- version/date term
- site-specific query

## parallel sub-agent fan-out 기준

web-research가 활성화되면 사용자가 단일 에이전트 조사를 명시하지 않는 한 parallel sub-agent fan-out을 기본 실행 경로로 쓴다. main agent는 질문을 독립 concept block으로 나누고, 하위 agent는 각 block의 source targeting, extraction, source ledger 초안을 만든다.

단일 에이전트 조사는 예외다. 사용자가 "단일 에이전트로 해줘"라고 요구했거나, private data가 포함됐거나, runtime/tool policy가 delegation을 막거나, official quick check 하나로 충분한 아주 작은 확인일 때만 main-agent query fan-out으로 처리한다.

단일 에이전트 예외를 쓰면 사용자에게 보이는 시작 업데이트나 최종 답변에 skip reason을 한 문장으로 남긴다. 예: "공식 문서 한 곳으로 끝나는 quick check라 단일 에이전트로 확인했습니다." 또는 "private repo 정보가 섞여 있어 하위 agent에 위임하지 않았습니다."

리서치 결과가 recommendation, comparison, implementation plan, skill update, PR, architecture note, product decision 같은 downstream artifact의 입력이면 verified search로 본다. 단일 official source가 질문을 완전히 끝낼 때를 제외하고는 broad browsing 전에 독립 lane을 나누고 sub-agent fan-out을 먼저 고려한다.

하위 agent 결과는 그대로 합치지 않는다. main agent가 source ledger를 병합하고, 중복·출처 충돌·날짜 불일치·claim confidence를 최종 검토한다.

## stop rules 기준

- official source가 명확하고 최신이면 멈춘다.
- 서로 다른 권위 있는 source가 충돌하면 추가 source를 확인한다.
- recommendation은 최소 가격/availability/risk 근거가 있어야 멈춘다.

## source ledger 기준

| source | claim | date | confidence |
| --- | --- | --- | --- |
| URL | 확인한 주장 | 게시/접근 날짜 | high/medium/low |

## reporting template 기준

```text
결론
- <answer>

근거
- <source>: <claim>

주의
- <uncertainty/conflict>
```
