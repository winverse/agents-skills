# 디자인 리뷰 기준

## review model 기준

1. 제품 도메인과 주 사용자를 파악한다.
2. 기존 design system과 component pattern을 확인한다.
3. primary workflow가 빠르게 수행되는지 본다.
4. responsive layout과 text overflow를 확인한다.
5. state, error, empty, loading을 확인한다.

## product context matrix 기준

| 제품 | 우선 감각 |
| --- | --- |
| SaaS/CRM/운영툴 | 조용하고 밀도 있는 정보 구조 |
| 학습/콘텐츠 앱 | 읽기 흐름과 집중도 |
| 게임/인터랙티브 | 즉각성, 움직임, feedback |
| 랜딩/브랜드 | 첫 viewport에서 대상이 분명해야 함 |

## default taste profile 기준

- radius는 보통 8px 이하
- card 안에 card를 넣지 않음
- stable dimensions로 hover나 label 변경 시 layout shift 방지
- font size를 viewport width로 직접 scaling하지 않음
- 단일 색상 계열만 반복하는 palette를 피함

## evidence boundary 기준

layout overlap, runtime rendering, responsive issue는 가능하면 `browser-qa`로 확인한다.
